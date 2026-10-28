import { closeDb } from "../src/lib/db";
import { createArticle } from "../src/lib/news";
import { NewsError, type NewsInput } from "../src/lib/news-schema";

// Editorial starting set. Every item links to a verified primary announcement.
// Never run automatically from builds, requests or application startup.
const articles: NewsInput[] = [
  {
    title: "Genie 4 convierte una idea en un mundo que puedes explorar",
    description: "Google DeepMind presenta una nueva generación de simulación interactiva, con audio nativo y mundos que responden a instrucciones en tiempo real.",
    content: "Google DeepMind anunció Genie 4, un modelo para generar y explorar entornos interactivos. La propuesta combina imagen, movimiento y audio, y permite modificar una escena con instrucciones de texto mientras la simulación continúa.\n\nSegún el equipo, los modelos Gemini ayudan a mantener la coherencia del entorno. Google plantea aplicaciones en experiencias interactivas y en la creación de escenarios de entrenamiento para robots y agentes.\n\nEl lanzamiento comienza como una vista previa de investigación para evaluadores seleccionados. La compañía abrió una lista de espera y prevé ampliar el acceso antes de una disponibilidad general para consumidores y desarrolladores.",
    imageUrl: "https://lh3.googleusercontent.com/mKq26Yz8rlcAthtTHS2GaID7LuUM9a4zM16VHUszY-zyKly80QRUt5nn6V4jQN8_bJ4_UMesp1D_88ethzTEJPoo6NUPyhO76QZ7zNJM5KzfPE5GKjM%3Dw1440-h810-n-nu",
    company: "Google DeepMind", category: "Inteligencia artificial", tags: ["ia generativa", "genie 4", "simulación"],
    sourceUrl: "https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/", sourceName: "Google DeepMind", publishedAt: "2026-10-27T16:13:00.000Z", featured: true,
  },
  {
    title: "Apple lleva el chip M6 al MacBook Pro de 14 pulgadas",
    description: "El nuevo portátil incorpora CPU y GPU de 12 núcleos, conectividad Wi-Fi 7 y un mayor enfoque en ejecutar inteligencia artificial de forma local.",
    content: "Apple presentó el MacBook Pro de 14 pulgadas con M6 el 27 de octubre. El chip incorpora una CPU de 12 núcleos y una GPU de 12 núcleos, con aceleradores orientados al procesamiento de inteligencia artificial en el dispositivo.\n\nLa compañía anuncia mejoras en gráficos y tareas de IA frente al M5, junto con Wi-Fi 7 y Bluetooth 6. Las cifras de rendimiento y autonomía provienen de sus pruebas internas y dependen de la configuración y el uso.\n\nLas reservas comienzan el 28 de octubre y la disponibilidad está prevista para el 6 de noviembre. Para equipos de desarrollo, el anuncio amplía las opciones de hardware para compilar aplicaciones y experimentar con modelos locales.",
    imageUrl: "https://www.apple.com/newsroom/images/2026/10/apple-introduces-the-new-14-inch-macbook-pro-with-m6/article/Apple-MacBook-Pro-14-in-with-M6-hero-261027_big.jpg.large.jpg",
    company: "Apple", category: "Productos", tags: ["hardware", "macbook pro", "m6"],
    sourceUrl: "https://www.apple.com/newsroom/2026/10/apple-introduces-the-new-14-inch-macbook-pro-with-m6/", sourceName: "Apple Newsroom", publishedAt: "2026-10-27T12:00:00.000Z", featured: false,
  },
  {
    title: "Anthropic da el primer paso formal hacia una salida a bolsa",
    description: "La empresa presentó un formulario S-1 ante la SEC y manifestó su intención de cotizar en Nasdaq con el símbolo ANT.",
    content: "Anthropic anunció el 26 de octubre la presentación de un registro S-1 ante la Comisión de Bolsa y Valores de Estados Unidos para una propuesta de oferta pública inicial de acciones de clase A.\n\nLa compañía indicó su intención de cotizar en el Nasdaq Global Select Market bajo el símbolo ANT. En el momento del anuncio, todavía no había definido el número de acciones ni el rango de precios.\n\nLa presentación del registro no equivale a que la oferta ya esté aprobada o completada. El comunicado precisa que el registro aún no había entrado en vigor.",
    imageUrl: "https://www-cdn.anthropic.com/images/4zrzovbb/website/6d4a0d28992ade92d6fa63646fd9c9d318245c6c-2400x1260.jpg",
    company: "Anthropic", category: "Negocios", tags: ["empresas", "anthropic", "mercado"],
    sourceUrl: "https://www.anthropic.com/news/s1-sec", sourceName: "Anthropic", publishedAt: "2026-10-26T12:00:00.000Z", featured: false,
  },
  {
    title: "Agent Skills pasa a la Agentic AI Foundation",
    description: "Anthropic dona el estándar abierto de habilidades para agentes a la fundación de la Linux Foundation, con mantenimiento compartido por la comunidad.",
    content: "Anthropic anunció la donación de Agent Skills a la Agentic AI Foundation. El estándar organiza conocimientos especializados y procedimientos en carpetas que pueden incluir un archivo SKILL.md, scripts y material de referencia.\n\nLa transferencia abarca el nombre y logotipo, la organización de GitHub y el dominio agentskills.io. Según el anuncio, ingenieros de varias compañías seguirán participando como mantenedores individuales.\n\nLa hoja de ruta propuesta incluye versiones formales, un proceso de propuestas y orientación de seguridad. El objetivo es facilitar que un mismo conjunto de habilidades funcione en diferentes plataformas de agentes.",
    imageUrl: "https://www-cdn.anthropic.com/images/4zrzovbb/website/6d4a0d28992ade92d6fa63646fd9c9d318245c6c-2400x1260.jpg",
    company: "Anthropic", category: "Desarrollo", tags: ["agentes", "open source", "agent skills"],
    sourceUrl: "https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation", sourceName: "Anthropic", publishedAt: "2026-10-22T12:00:00.000Z", featured: false,
  },
  {
    title: "Claude Haiku 5.5 apunta a las tareas rápidas y de gran volumen",
    description: "El nuevo modelo pequeño de Anthropic está orientado a resúmenes, clasificación, consultas y trabajo como subagente, con un nivel de esfuerzo ajustable.",
    content: "Anthropic presentó Claude Haiku 5.5 el 7 de octubre. La compañía lo orienta a tareas repetitivas de gran volumen, como resumir información, clasificar solicitudes y consultar bases de datos.\n\nTambién lo plantea como un subagente que puede colaborar con modelos mayores en programación. Esta versión incorpora un ajuste de esfuerzo para elegir entre el costo y la profundidad del procesamiento.\n\nEl anuncio incluye cambios en precios y mejoras en uso de herramientas. Antes de adoptarlo en un flujo interno, conviene evaluar su calidad con tareas representativas y consultar las condiciones vigentes en la fuente oficial.",
    imageUrl: "https://www-cdn.anthropic.com/images/4zrzovbb/website/89e9b0fbfe0181f6ca565d913686ce8e49b5e9c2-1200x630.jpg",
    company: "Anthropic", category: "Inteligencia artificial", tags: ["claude", "modelos", "agentes"],
    sourceUrl: "https://www.anthropic.com/claude-haiku-5-5", sourceName: "Anthropic", publishedAt: "2026-10-07T12:00:00.000Z", featured: false,
  },
  {
    title: "Next.js 16.2 mejora el rendimiento y la depuración con agentes",
    description: "La actualización incorpora mejoras de inicio y renderizado, más de 200 ajustes en Turbopack y nuevas herramientas para trabajar con agentes de programación.",
    content: "Next.js 16.2 se publicó el 18 de marzo de 2026 con mejoras de rendimiento, depuración y compatibilidad con flujos de desarrollo asistidos por agentes. El equipo informa de más de 200 correcciones y mejoras de Turbopack.\n\nLa versión añade registros de funciones del servidor, una vista más clara de diferencias de hidratación y soporte de inspección para el servidor de producción. También presenta mejoras en el arranque del entorno de desarrollo y en el renderizado.\n\nLas herramientas para agentes incluyen instrucciones AGENTS.md en proyectos nuevos y reenvío de registros del navegador. La publicación oficial explica los cambios y enlaza los detalles técnicos para planificar una actualización.",
    imageUrl: "https://h8dxkfmaphn8o0p3.public.blob.vercel-storage.com/static/blog/next-16-2/twitter-card.png",
    company: "Vercel", category: "Desarrollo", tags: ["next.js", "turbopack", "frontend"],
    sourceUrl: "https://nextjs.org/blog/next-16-2", sourceName: "Next.js Blog", publishedAt: "2026-03-18T20:00:00.000Z", featured: false,
  },
];

async function main() {
  let inserted = 0;
  for (const article of articles) {
    try { await createArticle(article); inserted += 1; }
    catch (error) { if (!(error instanceof NewsError && error.status === 409)) throw error; }
  }
  console.log(`Noticias añadidas: ${inserted}. Fuentes verificadas: ${articles.length}. Las existentes se conservaron.`);
}

main().catch((error: unknown) => {
  console.error("No se pudo completar la carga inicial:", error instanceof Error ? error.name : "UnknownError");
  process.exitCode = 1;
}).finally(closeDb);
