import JSZip from 'jszip';
import saveAs from 'file-saver';
import { GeneratedCourse, Unit, Lesson } from '../types';

// Helper to clean filenames
const cleanName = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 25);
};

// The SCORM API wrapper script to include in every HTML file
// This handles the communication with Moodle
const SCORM_API_SCRIPT = `
<script>
  var API = null;

  function findAPI(win) {
    var findAPITries = 0;
    while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
      findAPITries++;
      if (findAPITries > 7) {
        return null;
      }
      win = win.parent;
    }
    return win.API;
  }

  function getAPI() {
    var theAPI = findAPI(window);
    if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined")) {
      theAPI = findAPI(window.opener);
    }
    return theAPI;
  }

  function initSCORM() {
    API = getAPI();
    if (API) {
      API.LMSInitialize("");
      // Set status to incomplete initially if not set
      var status = API.LMSGetValue("cmi.core.lesson_status");
      if (status == "not attempted") {
        API.LMSSetValue("cmi.core.lesson_status", "incomplete");
        API.LMSCommit("");
      }
    }
  }

  function finishLesson() {
    if (API) {
      // Just mark as completed on exit/button click since there is no quiz
      var mode = API.LMSGetValue("cmi.core.lesson_mode");
      if (mode != "review") {
         API.LMSSetValue("cmi.core.lesson_status", "completed");
         API.LMSCommit("");
      }
      API.LMSFinish("");
    }
  }

  window.onload = initSCORM;
  window.onunload = finishLesson;
</script>
`;

// Basic HTML Template for a Lesson
const createLessonHTML = (lesson: Lesson, unitTitle: string) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${lesson.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Roboto Condensed', sans-serif; }
      .content-text { white-space: pre-line; text-align: justify; }
    </style>
    ${SCORM_API_SCRIPT}
</head>
<body class="bg-slate-50 text-slate-800 p-6 md:p-12">
    <div class="max-w-4xl mx-auto space-y-8">
        <!-- Header -->
        <div class="bg-white rounded-lg p-8 shadow border border-slate-200">
            <div class="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">${unitTitle}</div>
            <h1 class="text-4xl font-extrabold text-slate-900 uppercase">${lesson.title}</h1>
        </div>

        <!-- Key Idea -->
        <div class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
            <div class="bg-amber-50 border-b border-amber-100 px-8 py-4">
                <h3 class="font-bold text-xl text-amber-800 uppercase">${lesson.keyIdea.title || 'Fundamentos Teóricos'}</h3>
            </div>
            <div class="p-8 text-xl font-normal leading-relaxed">
                <div class="content-text">
                  ${lesson.keyIdea.content}
                </div>
                ${lesson.image ? `
                <div class="mt-8 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                  <img src="${lesson.image}" alt="Infografía" class="w-full h-auto object-cover">
                </div>
                ` : ''}
            </div>
        </div>

        <div class="grid grid-cols-1 gap-8">
            <!-- Example -->
            <div class="bg-white rounded-lg shadow border border-slate-200 flex flex-col">
                <div class="bg-blue-50 border-b border-blue-100 px-8 py-4">
                     <h3 class="font-bold text-xl text-blue-800 uppercase">${lesson.example.title || 'Contextualización'}</h3>
                </div>
                <div class="p-8 text-xl font-normal leading-relaxed flex-grow content-text">
                    ${lesson.example.content}
                </div>
            </div>

            <!-- Activity -->
            <div class="bg-white rounded-lg shadow border border-slate-200 flex flex-col">
                <div class="bg-teal-50 border-b border-teal-100 px-8 py-4">
                     <h3 class="font-bold text-xl text-teal-800 uppercase">${lesson.activity.title || 'Situación de Aprendizaje'}</h3>
                </div>
                <div class="p-8 text-xl font-normal leading-relaxed flex-grow content-text">
                    ${lesson.activity.content}
                </div>
            </div>
        </div>

        <!-- Manual Completion Button -->
        <div class="text-center pt-12 pb-8">
             <button onclick="finishLesson()" class="bg-blue-600 text-white px-10 py-5 rounded-lg font-bold text-xl uppercase shadow hover:bg-blue-700 transition transform hover:scale-[1.01]">
                Marcar Lección como Completada
             </button>
             <p class="text-slate-500 mt-4 text-sm">Al hacer clic, se registrará el progreso en la plataforma LMS.</p>
        </div>
    </div>
</body>
</html>
  `;
};

export const downloadSCORM = async (course: GeneratedCourse) => {
  const zip = new JSZip();
  const { data } = course;
  
  // 1. Create Manifest XML (The brain of SCORM)
  let itemsXML = '';
  let resourcesXML = '';
  
  data.units.forEach((unit, uIdx) => {
    unit.lessons.forEach((lesson, lIdx) => {
      const id = `item_${uIdx}_${lIdx}`;
      const resId = `resource_${uIdx}_${lIdx}`;
      const fileName = `lesson_${uIdx}_${lIdx}.html`;
      
      // Structure item (TOC entry)
      itemsXML += `
      <item identifier="${id}" identifierref="${resId}">
        <title>${unit.title}: ${lesson.title}</title>
      </item>`;
      
      // Resource definition (File pointer)
      resourcesXML += `
      <resource identifier="${resId}" type="webcontent" href="${fileName}" adlcp:scormtype="sco">
        <file href="${fileName}" />
      </resource>`;

      // 2. Generate and Add HTML File
      const htmlContent = createLessonHTML(lesson, unit.title);
      zip.file(fileName, htmlContent);
    });
  });

  const manifest = `<?xml version="1.0" standalone="no" ?>
<manifest identifier="ProfesorIA_Course_${Date.now()}" version="1.0"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="ProfesorIA_Org">
    <organization identifier="ProfesorIA_Org">
      <title>${data.title}</title>
      ${itemsXML}
    </organization>
  </organizations>
  <resources>
    ${resourcesXML}
  </resources>
</manifest>`;

  zip.file("imsmanifest.xml", manifest);

  // 3. Generate ZIP and Download
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `SCORM1.2_${cleanName(data.title)}.zip`);
};