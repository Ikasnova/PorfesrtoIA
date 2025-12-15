import { GoogleGenAI } from "@google/genai";
import { COURSE_BUILDER_PROMPT } from "../constants";
import { GeneratedCourse, UserInput, CourseData, Unit, Lesson } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateInfographicForLesson = async (topic: string, lessonTitle: string, keyConcept: string): Promise<string | undefined> => {
  try {
    const prompt = `
      Genera una imagen tipo ilustración vectorial plana (flat vector art), educativa y minimalista.
      Tema: ${topic}.
      Concepto específico a ilustrar: ${lessonTitle} - ${keyConcept}.
      Estilo: Infografía limpia, fondo blanco o muy claro, colores profesionales (#277cd4, #3eb7ae).
      REGLA CRÍTICA: ABSOLUTAMENTE SIN TEXTO. NO incluyas palabras, letras, números ni texto simulado. Usa solo iconografía, diagramas mudos y metáforas visuales.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
            aspectRatio: "16:9",
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (error) {
    console.warn(`Failed to generate image for lesson ${lessonTitle}:`, error);
    return undefined; // Fail gracefully without crashing the course generation
  }
};

export const generateCourse = async (input: UserInput): Promise<GeneratedCourse> => {
  const userPrompt = `
    TEMA O MATERIA: ${input.topic}
    ETAPA EDUCATIVA (CURRÍCULO NAVARRA): ${input.stage}
    NIVEL ESPECÍFICO: ${input.level}
    PERFIL ALUMNO: ${input.profile}
    OBJETIVO DE APRENDIZAJE: ${input.goal}
    TEMPORALIZACIÓN: ${input.time}
    METODOLOGÍA PREFERIDA: ${input.format}
  `;

  try {
    // 1. Generate Text Content
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: COURSE_BUILDER_PROMPT + "\n\nDATOS DEL DOCENTE/USUARIO:\n" + userPrompt }] }
      ],
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extract JSON
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;

    let parsedData: CourseData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON", e);
      throw new Error("La respuesta de la IA no tuvo el formato esperado. Por favor, inténtalo de nuevo.");
    }

    // 2. Generate Images for Lessons (Parallel)
    // We iterate through units and lessons to trigger image generation
    const imagePromises: Promise<void>[] = [];

    parsedData.units.forEach((unit: Unit) => {
      unit.lessons.forEach((lesson: Lesson) => {
        const p = generateInfographicForLesson(input.topic, lesson.title, lesson.keyIdea.content)
          .then((imgData) => {
            if (imgData) {
              lesson.image = imgData;
            }
          });
        imagePromises.push(p);
      });
    });

    // Wait for all images to generate (or fail gracefully)
    await Promise.all(imagePromises);

    // 3. Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter((source: any) => source !== null) as { title?: string; uri: string }[];

    const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

    return {
      data: parsedData,
      sources: uniqueSources,
    };

  } catch (error) {
    console.error("Error generating course:", error);
    throw error;
  }
};