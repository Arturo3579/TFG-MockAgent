import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { Sun, Moon, Zap, Check, Sparkles, ArrowLeft, Mail, UserPlus, AlertTriangle, Trash2, X, Terminal, Play, Code, HelpCircle, Shield, Clock, Server, ChevronDown, ChevronUp, ExternalLink, Lock, FileJson, Globe, CreditCard, Users, BookOpen, FileText, Scale, Calendar, Copy, CheckCircle, ArrowUp, Loader2, Activity, MessageCircle, Send, Menu, User } from 'lucide-react';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (window.location.hostname.includes('localhost') ? 'http://localhost:9090' : 'https://tfg-mockagent-production.up.railway.app'),
});

const getToken = () => sessionStorage.getItem('token') || localStorage.getItem('token');

// ============================
// SMART AI ASSISTANT - MockAgent.AI Specialist
// ============================
const getAIResponse = (question, context, messageHistory = []) => {
  const q = question.toLowerCase().trim();
  const history = messageHistory.filter(m => m.sender === 'user').map(m => m.text.toLowerCase());
  const lastUserMessage = history.length > 0 ? history[history.length - 1] : null;
  
  // Helper: build response
  const r = (text, suggestions = [], topic = null) => ({
    text, suggestions,
    newContext: { lastTopic: topic || context.lastTopic, lastQuestion: q, messageCount: (context.messageCount || 0) + 1 }
  });

  if (!q) return r('¡Hola! Soy el asistente especialista de MockAgent.AI. ¿En qué puedo ayudarte?', ['Ver planes y precios', 'Cómo crear un mock', 'Qué es MockAgent']);

  // ============================================
  // 1. SALUDOS NATURALES
  // ============================================
  const GREETINGS = ['hola', 'hey', 'buenas', 'saludos', 'buenos dias', 'buenas tardes', 'buenas noches', 'qué tal', 'que tal', 'holi', 'hello', 'hi', 'qué onda', 'que onda', 'qué hay', 'que hay', 'qué pasa', 'que pasa'];
  if (GREETINGS.some(w => q === w || q.startsWith(w + ' '))) {
    const hour = new Date().getHours();
    let greeting = '¡Hola!';
    if (hour >= 5 && hour < 12) greeting = '¡Buenos días! ☀️';
    else if (hour >= 12 && hour < 20) greeting = '¡Buenas tardes!';
    else greeting = '¡Buenas noches! 🌙';
    
    return r(
      `${greeting} Soy el asistente de MockAgent.AI. Estoy aquí para ayudarte con todo lo relacionado con nuestra plataforma de mocking.\n\n¿Quieres crear mocks, ver planes, o necesitas ayuda con algo específico?`,
      ['Ver planes y precios', 'Cómo crear un mock', 'Ver documentación']
    );
  }

  // ============================================
  // 2. DESPEDIDAS
  // ============================================
  const GOODBYES = ['gracias', 'adios', 'bye', 'hasta luego', 'nos vemos', 'chao', 'cuídate', 'perfecto', 'vale gracias', 'ok gracias', 'muchas gracias', 'gracias por todo', 'hasta pronto', 'nos vemos luego'];
  if (GOODBYES.some(w => q.includes(w))) {
    return r('¡Ha sido un placer! Si necesitas algo más sobre MockAgent.AI, aquí estaré. ¡Que tengas un excelente día! 🚀', ['Volver a la web', 'Contactar soporte']);
  }

  // ============================================
  // 3. QUÉ ES MOCKAGENT (específico de la web)
  // ============================================
  if (q.includes('qué es mockagent') || q.includes('que es mockagent') || q.includes('quien es mockagent') || q.includes('mockagent.ai') || q.includes('sobre mockagent') || q.includes('qué hace mockagent') || q.includes('para qué sirve mockagent') || q.includes('qué es esta web') || q.includes('qué es esta página')) {
    return r(
      `MockAgent.AI es tu plataforma de mocking de APIs diseñada específicamente para equipos que desarrollan agentes de IA.\n\n**Lo que puedes hacer aquí:**\n• Crear endpoints de API simulados en segundos\n• Prototipar sin depender de servidores externos\n• Testar tus agentes de IA con respuestas JSON reales\n• Escalar desde Free hasta Premium según tus necesidades\n• Todo desde mockagentai.com, sin instalar nada\n\n¿Te gustaría probarlo ahora o ver los planes disponibles?`,
      ['Probar Mock Express', 'Ver planes', 'Crear cuenta gratis'],
      'mockagent_intro'
    );
  }

  // ============================================
  // 4. CREAR MOCK / MOCK EXPRESS
  // ============================================
  if (q.includes('mock') || q.includes('endpoint') || q.includes('crear api') || q.includes('simular') || q.includes('fake api') || q.includes('dummy') || q.includes('stub') || q.includes('prueba api') || q.includes('test api') || q.includes('api falsa') || q.includes('express')) {
    // Si pregunta específicamente por Mock Express
    if (q.includes('express') || q.includes('sin registro') || q.includes('sin cuenta')) {
      return r(
        `**Mock Express** es la forma más rápida de probar MockAgent.AI sin crear cuenta:\n\n1. En la página principal (mockagentai.com), ve a la sección "Instant Mock"\n2. Escribe un nombre para tu API (ej: mi-api)\n3. Haz clic en **"Crear Mock Express"**\n4. ¡Listo! Recibes una URL pública al instante como:\n   https://tfg-mockagent-production.up.railway.app/mock/mi-api\n\nEs gratis, sin registro, y perfecto para pruebas rápidas.`,
        ['Ver planes para más features', 'Crear cuenta gratis', 'Cómo funciona el dashboard']
      );
    }
    
    return r(
      `En MockAgent.AI puedes crear mocks de dos formas:\n\n**1. Mock Express (sin registro):**\n• En la landing page, escribe un nombre y haz clic en "Crear Mock Express"\n• URL pública al instante\n\n**2. Desde el Dashboard (con cuenta):**\n• Regístrate gratis → Dashboard → "Nuevo Endpoint"\n• Define: ruta, método HTTP, status code, JSON de respuesta\n• Guarda y obtén tu URL privada\n\n¿Quieres probar el Mock Express o necesitas crear uno más avanzado?`,
      ['Probar Mock Express', 'Crear cuenta gratis', 'Ver planes y precios'],
      'mock_creation'
    );
  }

  // ============================================
  // 5. PLANES Y PRECIOS
  // ============================================
  if (q.includes('precio') || q.includes('plan') || q.includes('costo') || q.includes('cuanto cuesta') || q.includes('gratis') || q.includes('free') || q.includes('pro') || q.includes('premium') || q.includes('pago') || q.includes('tarjeta') || q.includes('suscripcion') || q.includes('subscripcion') || q.includes('mensual') || q.includes('anual') || q.includes('cuota') || q.includes('vale la pena') || q.includes('rentable') || q.includes('descuento') || q.includes('oferta')) {
    return r(
      `MockAgent.AI tiene **3 planes** para que escales según necesites:\n\n**Free — $0/mes**\n• 5 endpoints\n• 100 peticiones/día\n• Logs 24h\n• Sin tarjeta, para siempre\n\n**Pro — $4.99/mes** ($2.99 si pagas anual)\n• Endpoints ilimitados\n• 5.000 peticiones/día\n• 1.000 req/min\n• Logs 7 días\n\n**Premium — $7.99/mes** ($5.99 anual)\n• 10.000 peticiones/día\n• 1.500 req/min\n• Logs 14 días + Webhooks\n• Soporte prioritario <24h\n\nSin permanencia. Cambia o cancela cuando quieras.`,
      ['Crear cuenta gratis', 'Probar Mock Express', 'Ver comparativa con competidores'],
      'pricing'
    );
  }

  // ============================================
  // 6. LOGIN / REGISTRO / CUENTA
  // ============================================
  if (q.includes('login') || q.includes('registrar') || q.includes('cuenta') || q.includes('signup') || q.includes('acceso') || q.includes('entrar') || q.includes('sesion') || q.includes('password') || q.includes('contraseña') || q.includes('email') || q.includes('correo') || q.includes('usuario') || q.includes('olvide') || q.includes('recuperar')) {
    return r(
      `**Crear cuenta en MockAgent.AI es gratis y rápido:**\n\n1. Ve a mockagentai.com y haz clic en **"Empezar Gratis"**\n2. Introduce tu email y contraseña\n   (mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 especial)\n3. ¡Listo! Tu token JWT se guarda automáticamente\n\n**Datos importantes:**\n• No requiere tarjeta de crédito\n• Plan Free incluido: 5 endpoints + 100 peticiones/día\n• Puedes marcar "Recuérdame" para no cerrar sesión\n• ¿Olvidaste tu contraseña? Escríbenos a mockagentai@gmail.com`,
      ['Crear cuenta ahora', 'Ver seguridad', 'Probar sin registro'],
      'auth'
    );
  }

  // ============================================
  // 7. DASHBOARD / MI CUENTA / PERFIL
  // ============================================
  if (q.includes('dashboard') || q.includes('panel') || q.includes('mi cuenta') || q.includes('perfil') || q.includes('admin') || q.includes('gestionar') || q.includes('mis endpoints') || q.includes('mis mocks') || q.includes('donde veo')) {
    return r(
      `El **Dashboard** de MockAgent.AI es tu centro de control:\n\n**Desde ahí puedes:**\n• Crear, editar y eliminar endpoints de mock\n• Ver todos tus mocks activos\n• Consultar logs de peticiones en tiempo real\n• Gestionar tu plan y upgrade\n• Copiar URLs de tus mocks para usar en tus proyectos\n\n**Acceso:** Inicia sesión en mockagentai.com y haz clic en "Mi cuenta" en el navbar.\n\n¿Necesitas ayuda con algo específico del dashboard?`,
      ['Crear cuenta gratis', 'Ver planes', 'Cómo crear un mock'],
      'dashboard'
    );
  }

  // ============================================
  // 8. LÍMITES Y RATE LIMITING
  // ============================================
  if (q.includes('limite') || q.includes('límite') || q.includes('peticiones') || q.includes('requests') || q.includes('cuantas') || q.includes('cuántas') || q.includes('429') || q.includes('too many') || q.includes('bloqueo') || q.includes('exceder') || q.includes('diario')) {
    return r(
      `Cada plan de MockAgent.AI tiene límites claros:\n\n**Free:** 100 peticiones/día | 100/min | 5 endpoints\n**Pro:** 5.000 peticiones/día | 1.000/min | Ilimitados\n**Premium:** 10.000 peticiones/día | 1.500/min | Ilimitados\n\n**¿Qué pasa si llegas al límite?**\nRecibes un error **429 Too Many Requests**. El contador se reinicia automáticamente a las 00:00 UTC cada día.\n\n**Para evitar interrupciones:** Puedes upgrade a Pro en cualquier momento desde tu perfil. Es inmediato.`,
      ['Upgrade a Pro', 'Ver todos los planes', 'Crear cuenta gratis'],
      'rate_limits'
    );
  }

  // ============================================
  // 9. SEGURIDAD
  // ============================================
  if (q.includes('seguridad') || q.includes('seguro') || q.includes('privado') || q.includes('jwt') || q.includes('token') || q.includes('proteccion') || q.includes('cifrado') || q.includes('bcrypt') || q.includes('auth') || q.includes('hackear') || q.includes('datos') || q.includes('gdpr') || q.includes('privacidad')) {
    return r(
      `La seguridad en MockAgent.AI es prioridad absoluta:\n\n**Autenticación:**\n• Tokens JWT con firma HMAC-SHA256\n• Expiración 24h + opción "Recuérdame"\n• Contraseñas hasheadas con bcrypt (cost factor 12)\n\n**Aislamiento:**\n• Cada usuario solo accede a sus propios endpoints y logs\n• Consultas SQL parametrizadas contra inyección\n• Rate limiting por IP y por usuario\n\n**Infraestructura:**\n• TLS/SSL en todas las conexiones\n• Datos almacenados en TiDB Cloud con encriptación\n• Sin cookies de tracking de terceros\n\nTu información nunca se comparte con terceros.`,
      ['Ver planes con más seguridad', 'Crear cuenta gratis', 'Contactar soporte'],
      'security'
    );
  }

  // ============================================
  // 10. LOGS
  // ============================================
  if (q.includes('log') || q.includes('historial') || q.includes('registro') || q.includes('peticiones pasadas') || q.includes('debug') || q.includes('tracking') || q.includes('quien ha llamado') || q.includes('ver requests')) {
    return r(
      `MockAgent.AI registra automáticamente cada petición que reciben tus endpoints:\n\n**Retención según plan:**\n• Free: últimas 24 horas\n• Pro: últimos 7 días\n• Premium: últimos 14 días\n\n**Datos que puedes ver:**\n• Timestamp exacto (fecha y hora)\n• Método HTTP (GET, POST, PUT, DELETE)\n• Ruta completa del endpoint\n• Código de estado devuelto\n• Request body y headers relevantes\n• IP de origen (anonimizada)\n\nAccede desde tu Dashboard → "Logs de Peticiones".`,
      ['Ver planes para más retención', 'Ir al Dashboard', 'Crear cuenta gratis'],
      'logs'
    );
  }

  // ============================================
  // 11. COMPARATIVA
  // ============================================
  if (q.includes('comparar') || q.includes('beeceptor') || q.includes('postman') || q.includes('competidor') || q.includes('alternativa') || q.includes('vs') || q.includes('versus') || q.includes('mejor que') || q.includes('diferencia') || q.includes('por qué mockagent') || q.includes('ventaja') || q.includes('review') || q.includes('opinion') || q.includes('vale la pena')) {
    return r(
      `¿Por qué elegir MockAgent.AI sobre la competencia?\n\n**vs Beeceptor ($12/mes):**\nMockAgent cuesta $4.99, es auto-alojable, y tus datos son tuyos.\n\n**vs Postman ($14/mes):**\nSin ruido de features innecesarias. Especializado 100% en mocking.\n\n**vs WireMock:**\nUI visual y web. No necesitas código Java/Groovy.\n\n**vs Mockbin:**\nPersistencia real con MySQL/TiDB. No se pierde nada al reiniciar.\n\n**Diferenciador único:** Rate limiting configurable por plan + retención de logs ajustable. Nadie más lo ofrece.`,
      ['Ver planes y precios', 'Crear cuenta gratis', 'Probar Mock Express'],
      'comparison'
    );
  }

  // ============================================
  // 12. SOPORTE / AYUDA / PROBLEMAS
  // ============================================
  if (q.includes('soporte') || q.includes('ayuda') || q.includes('contacto') || q.includes('problema') || q.includes('bug') || q.includes('error') || q.includes('fallo') || q.includes('no funciona') || q.includes('broken') || q.includes('issue') || q.includes('ticket') || q.includes('reportar') || q.includes('help')) {
    return r(
      `Estamos aquí para ayudarte con MockAgent.AI:\n\n**Canales de soporte:**\n• **Email:** mockagentai@gmail.com (respuesta en 24-48h)\n• **Documentación:** Sección Docs en la web con ejemplos de curl\n• **Blog:** Artículos técnicos sobre mocking y testing\n\n**Soporte Prioritario (Premium $7.99/mes):**\n• Respuesta garantizada en menos de 24h\n• Acceso directo al equipo de ingeniería\n• Prioridad en reportes de bugs\n\n**Autodiagnóstico rápido:**\n• 401 = token JWT expirado (vuelve a loguearte)\n• 429 = has alcanzado tu límite diario\n• 500 = error inesperado del servidor`,
      ['Ver planes Premium', 'Ver documentación', 'Crear cuenta gratis'],
      'support'
    );
  }

  // ============================================
  // 13. DOCUMENTACIÓN / API / CURL
  // ============================================
  if (q.includes('docs') || q.includes('documentacion') || q.includes('api') || q.includes('referencia') || q.includes('swagger') || q.includes('openapi') || q.includes('curl') || q.includes('endpoint') || q.includes('rutas') || q.includes('metodos') || q.includes('código de estado') || q.includes('status code')) {
    return r(
      `Documentación completa de la API de MockAgent.AI:\n\n**Autenticación (requiere JWT):**\n• POST /api/auth/signup — Crear cuenta\n• POST /api/auth/login — Iniciar sesión\n• GET /api/auth/profile — Ver perfil\n\n**Gestión de Mocks (requiere JWT):**\n• GET /admin/endpoints — Listar tus mocks\n• POST /admin/endpoints — Crear mock\n• PUT /admin/endpoints/{id} — Editar\n• DELETE /admin/endpoints/{id} — Eliminar\n\n**Público (sin auth):**\n• Cualquier método en /mock/** — Llamar a tu mock\n• POST /api/instant/create — Crear mock express\n\nTodos los endpoints admin requieren header: Authorization: Bearer <token>`,
      ['Ver sección Docs', 'Ejemplos con curl', 'Crear cuenta gratis'],
      'docs'
    );
  }

  // ============================================
  // 14. WEBHOOKS
  // ============================================
  if (q.includes('webhook') || q.includes('notificacion') || q.includes('alerta') || q.includes('evento') || q.includes('callback') || q.includes('slack') || q.includes('discord') || q.includes('zapier')) {
    return r(
      `Los webhooks están disponibles en el plan **Premium** ($7.99/mes):\n\n**Eventos que puedes recibir:**\n• Petición recibida en tu endpoint\n• Límite de rate alcanzado (80% y 100%)\n• Error 5xx en el servidor\n• Endpoint creado/modificado/eliminado\n\n**Formato:** POST a tu URL con payload JSON + HMAC-SHA256 para verificar origen.\n\n**Próximamente:**\n• Integración nativa con Slack y Discord\n• Webhooks condicionales\n• Reintentos automáticos con backoff`,
      ['Ver plan Premium', 'Ver todos los planes', 'Crear cuenta gratis'],
      'webhooks'
    );
  }

  // ============================================
  // 15. INFRAESTRUCTURA / DESPLIEGUE
  // ============================================
  if (q.includes('hosting') || q.includes('deploy') || q.includes('desplegar') || q.includes('servidor') || q.includes('infraestructura') || q.includes('railway') || q.includes('vercel') || q.includes('tidb') || q.includes('base de datos') || q.includes('mysql') || q.includes('nube') || q.includes('cloud')) {
    return r(
      `MockAgent.AI está desplegada en la nube con arquitectura moderna:\n\n**Frontend:** Vercel (mockagentai.com)\n**Backend:** Railway + Docker (Spring Boot)\n**Base de datos:** TiDB Cloud (MySQL distribuido)\n**CDN:** Cloudflare para assets estáticos\n\n**Ventajas:**\n• Uptime 99.9% garantizado\n• SSL/TLS automático en todos los dominios\n• Escalado automático según demanda\n• Backups diarios de la base de datos\n\nTodo gestionado por nosotros. Tú solo te preocupas de crear mocks.`,
      ['Ver planes', 'Crear cuenta gratis', 'Soporte técnico'],
      'infra'
    );
  }

  // ============================================
  // 16. SHORT / AMBIGUOUS
  // ============================================
  if (q.length < 4 || ['ok', 'sí', 'si', 'no', 'ya', 'genial', 'perfecto', 'vale', 'bueno'].includes(q)) {
    // Si hay contexto previo
    if (context.lastTopic) {
      return r(
        `Entiendo. ¿Quieres que profundice en ese tema o prefieres que te muestre otras opciones de MockAgent.AI?`,
        ['Sí, cuéntame más', 'Ver otros temas', 'Ir a la web']
      );
    }
    return r(
      `Veo que tu mensaje es muy corto. ¿Te refieres a alguno de estos temas de MockAgent.AI?`,
      ['Planes y precios', 'Crear un mock', 'Ver documentación', 'Soporte técnico']
    );
  }

  // ============================================
  // 17. OFF-TOPIC
  // ============================================
  const OFF_TOPIC = [
    'clima', 'tiempo', 'weather', 'llueve', 'soleado', 'temperatura',
    'política', 'politica', 'elecciones', 'gobierno', 'presidente',
    'deporte', 'fútbol', 'football', 'baloncesto', 'tenis', 'nba',
    'música', 'musica', 'canción', 'cancion', 'artista', 'spotify',
    'película', 'pelicula', 'netflix', 'serie', 'cine', 'actor',
    'cocina', 'receta', 'comida', 'restaurante', 'chef',
    'coche', 'carro', 'auto', 'moto', 'motor', 'formula 1',
    'viaje', 'vuelo', 'hotel', 'vacaciones', 'turismo',
    'bitcoin', 'ethereum', 'crypto', 'cripto', 'invertir', 'bolsa',
    'noticia', 'periodico', 'diario', 'tv', 'television',
    'juego', 'videojuego', 'gaming', 'playstation', 'xbox',
    'moda', 'ropa', 'zapatos', 'marca', 'diseñador',
    'perro', 'gato', 'mascota', 'animal', 'veterinario',
    'salud', 'médico', 'medico', 'hospital', 'enfermedad', 'doctor',
    'relación', 'pareja', 'amor', 'novio', 'novia', 'boda',
    'trabajo', 'empleo', 'cv', 'curriculum', 'entrevista', 'sueldo',
    'iphone', 'android', 'samsung', 'apple', 'google', 'microsoft',
    'instagram', 'tiktok', 'facebook', 'twitter', 'whatsapp',
    'chatgpt', 'openai', 'gpt', 'bard', 'gemini',
    'python', 'javascript', 'java', 'react', 'angular', 'programar',
    'dios', 'religión', 'iglesia', 'fe', 'biblia',
    'guerra', 'ejercito', 'arma', 'onu', 'otan', 'nato',
    'hack', 'hacker', 'virus', 'malware', 'estafa',
    'droga', 'alcohol', 'tabaco', 'marihuana',
    'sexo', 'porn', 'onlyfans', 'escort',
    'suicidio', 'matar', 'muerte', 'asesinar', 'violencia',
    'racismo', 'nazi', 'hitler', 'terrorismo',
    'chiste', 'broma', 'humor', 'meme',
    'horoscopo', 'zodiaco', 'tarot', 'bruj',
    'ovni', 'extraterrestre', 'fantasma',
    'cumpleaños', 'fiesta', 'navidad', 'halloween'
  ];

  if (OFF_TOPIC.some(w => q.includes(w))) {
    return r(
      `Lo siento, soy el asistente especialista de MockAgent.AI y solo puedo ayudarte con temas de nuestra plataforma de mocking de APIs.\n\n**Temas en los que puedo ayudarte:**\n• Crear y gestionar mocks\n• Planes y precios\n• Seguridad y autenticación\n• Documentación de la API\n• Logs y debugging\n• Soporte técnico\n\n¿Te gustaría saber algo sobre alguno de estos temas?`,
      ['¿Qué es MockAgent?', 'Ver planes y precios', 'Cómo empezar']
    );
  }

  // ============================================
  // 18. FALLBACK INTELIGENTE
  // ============================================
  return r(
    `¡Buena pregunta! Como asistente de MockAgent.AI, puedo ayudarte con estos temas. ¿Cuál te interesa?`,
    ['¿Qué es MockAgent?', 'Planes y precios', 'Crear un mock', 'Documentación API', 'Soporte técnico', 'Seguridad']
  );
};

const ChatWidget = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: '¡Hola! Soy el asistente de MockAgent. ¿En qué puedo ayudarte?', suggestions: ['¿Qué es un mock?', 'Ver planes y precios', 'Cómo empezar'] }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatContext, setChatContext] = useState({ lastTopic: null, lastQuestion: null, messageCount: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const sendMessage = (textOverride = null) => {
    const userMsg = textOverride || chatInput.trim();
    if (!userMsg) return;
    
    if (!textOverride) setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsTyping(true);
    
    setTimeout(() => {
      const currentHistory = [...chatMessages, { sender: 'user', text: userMsg }];
      const result = getAIResponse(userMsg, chatContext, currentHistory);
      setChatMessages(prev => [...prev, { sender: 'ai', text: result.text, suggestions: result.suggestions }]);
      setChatContext(result.newContext);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const panelWidth = isMobile ? 'calc(100vw - 24px)' : '360px';
  const panelHeight = isMobile ? 'calc(100vh - 120px)' : '520px';
  const panelRight = isMobile ? '12px' : '24px';
  const panelBottom = isMobile ? '80px' : '90px';

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: isMobile ? '16px' : '24px',
          right: isMobile ? '16px' : '24px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#C9A96E',
          color: '#0a0a1e',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(201,169,110,0.4), 0 0 40px rgba(201,169,110,0.2)',
          zIndex: 9999,
          fontSize: '22px'
        }}
      >
        {chatOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed',
              bottom: panelBottom,
              right: panelRight,
              width: panelWidth,
              maxHeight: panelHeight,
              height: panelHeight,
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: isMobile ? '12px' : '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(201,169,110,0.1)',
              zIndex: 9998,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: isMobile ? '12px 16px' : '14px 18px',
              backgroundColor: 'rgba(201,169,110,0.1)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#C9A96E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0a0a1e'
              }}>
                <Zap size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }}>Asistente MockAgent</div>
                <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  En línea
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: isMobile ? '12px 14px' : '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                  <div
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      padding: '10px 14px',
                      borderRadius: msg.sender === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      backgroundColor: msg.sender === 'user' ? '#C9A96E' : 'var(--bg-color)',
                      color: msg.sender === 'user' ? '#0a0a1e' : 'var(--text-main)',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '4px' }}>
                      {msg.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(s)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '999px',
                            border: '1px solid rgba(201,169,110,0.25)',
                            backgroundColor: 'rgba(201,169,110,0.06)',
                            color: '#C9A96E',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: '0.2s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.15)'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.06)'; }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div style={{
                  alignSelf: 'flex-start',
                  padding: '10px 14px',
                  borderRadius: '14px 14px 14px 4px',
                  backgroundColor: 'var(--bg-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'typingBounce 1.4s infinite', animationDelay: '0s' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'typingBounce 1.4s infinite', animationDelay: '0.2s' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'typingBounce 1.4s infinite', animationDelay: '0.4s' }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: isMobile ? '10px 12px' : '12px 16px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '8px',
              flexShrink: 0,
              backgroundColor: 'var(--card-bg)'
            }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-color)',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  outline: 'none',
                  minWidth: 0
                }}
              />
              <button
                onClick={() => sendMessage()}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#C9A96E',
                  color: '#0a0a1e',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
const setToken = (token, remember) => {
  if (remember) { localStorage.setItem('token', token); sessionStorage.removeItem('token'); }
  else { sessionStorage.setItem('token', token); localStorage.removeItem('token'); }
};
const removeToken = () => { sessionStorage.removeItem('token'); localStorage.removeItem('token'); };
const getUserPlan = () => sessionStorage.getItem('userPlan') || localStorage.getItem('userPlan');
const saveUserPlan = (plan, remember) => {
  if (remember) { localStorage.setItem('userPlan', plan); sessionStorage.removeItem('userPlan'); }
  else { sessionStorage.setItem('userPlan', plan); localStorage.removeItem('userPlan'); }
};
const removeUserPlan = () => { sessionStorage.removeItem('userPlan'); localStorage.removeItem('userPlan'); };
  const saveUserEmail = (email, remember) => {
    if (remember) { localStorage.setItem('userEmail', email); sessionStorage.removeItem('userEmail'); }
    else { sessionStorage.setItem('userEmail', email); localStorage.removeItem('userEmail'); }
  };
  const removeUserEmail = () => { sessionStorage.removeItem('userEmail'); localStorage.removeItem('userEmail'); };
  const getUserEmail = () => sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
  
  const saveFullName = (name, remember) => {
    if (remember) { localStorage.setItem('fullName', name); sessionStorage.removeItem('fullName'); }
    else { sessionStorage.setItem('fullName', name); localStorage.removeItem('fullName'); }
  };
  const saveUserName = (name, remember) => {
    if (remember) { localStorage.setItem('userName', name); sessionStorage.removeItem('userName'); }
    else { sessionStorage.setItem('userName', name); localStorage.removeItem('userName'); }
  };
const hasRememberedSession = () => !!localStorage.getItem('token');

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      const url = err.config?.url || '';
      if (url.includes('/api/auth/login') || url.includes('/api/auth/signup') || url.includes('/api/auth/logout')) {
        return Promise.reject(err);
      }
      const msg = err.response.data?.message || '';
      if (msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('límite') || msg.toLowerCase().includes('upgrade')) {
        return Promise.reject(err);
      }
      removeToken();
      removeUserPlan();
      removeUserEmail();
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

const PLAN_LIMITS = { starter: 5, pro: Infinity, premium: Infinity };

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.75 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110.0 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.5 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.90 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 8.50 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 20.0 }
];

const PRICING_PLANS = [
  {
    id: "starter",
    name: "Free",
    price: { monthly: 0, annual: 0 },
    priceSuffix: "/mes",
    highlighted: false,
    features: [
      "Hasta 5 Mock Endpoints activos",
      "100 peticiones/día al /mock/**",
      "Logs de las últimas 24 horas",
      "Respuestas JSON instantáneas",
      "1 usuario"
    ],
    cta: "Empezar Gratis"
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 4.99, annual: 2.99 },
    priceSuffix: "/mes",
    annualBilling: 35.88,
    highlighted: true,
    features: [
      "Mock Endpoints ilimitados",
      "5.000 peticiones/día",
      "Logs de los últimos 7 días",
      "1.000 req/min",
      "1 usuario"
    ],
    cta: "Elegir Pro"
  },
  {
    id: "premium",
    name: "Premium",
    price: { monthly: 7.99, annual: 5.99 },
    priceSuffix: "/mes",
    annualBilling: 71.88,
    highlighted: false,
    features: [
      "Mock Endpoints ilimitados",
      "10.000 peticiones/día",
      "Logs de los últimos 14 días",
      "1.500 req/min",
      "Webhooks (próximamente)",
      "Soporte prioritario",
      "1 usuario"
    ],
    cta: "Elegir Premium"
  }
];

const TEAM_CTA = {
  title: "¿Necesitas más?",
  description: "Contacta con nosotros para equipos y empresas. Próximamente: workspaces compartidos, SSO y auditoría extendida.",
  cta: "Contactar ventas"
};

const STATS = [
  { value: "10x", label: "Más rápido que APIs reales" },
  { value: "65%", label: "Reducción en costes de API" },
  { value: "99.9%", label: "Uptime garantizado" }
];

const aboutCards = [
  { num: "01", title: "¿Quiénes Somos?", desc: "Somos un equipo de ingenieros de software y arquitectos de IA cansados de los cuellos de botella en el desarrollo de agentes autónomos. Creamos entornos simulados de alto rendimiento para acelerar tus despliegues.", icon: "🎯" },
  { num: "02", title: "El Problema que Resolvemos", desc: "Hacer llamadas constantes a APIs reales durante el desarrollo e integración es extremadamente costoso y arriesgado. Eliminamos ese gasto permitiéndote emular cualquier respuesta HTTP en milisegundos.", icon: "🛑" },
  { num: "03", title: "¿Por qué confiar en nosotros?", desc: "Garantizamos una arquitectura robusta con persistencia SQL avanzada y aislamiento total de datos. Tu lógica corporativa y de pruebas está blindada bajo estándares de cifrado empresarial.", icon: "🔒" }
];

const trustItems = [
  { icon: "🛡️", title: "Seguridad empresarial", desc: "Cifrado end-to-end y aislamiento de datos por workspace." },
  { icon: "⚡", title: "Latencia <10ms", desc: "Respuestas instantáneas para no ralentizar tus tests." },
  { icon: "🔄", title: "Cero configuración", desc: "Crea y publica endpoints en segundos, sin infraestructura." }
];

const HOW_IT_WORKS_STEPS = [
  { num: "01", title: "Define tu endpoint", desc: "Elige la ruta (ej. /api/v1/users), el método HTTP y el código de status que quieres simular.", icon: <Globe size={20} /> },
  { num: "02", title: "Configura la respuesta", desc: "Pega tu JSON de respuesta en el editor. Valida la sintaxis en tiempo real antes de publicar.", icon: <FileJson size={20} /> },
  { num: "03", title: "Llama a tu mock", desc: "Usa la URL https://tfg-mockagent-production.up.railway.app/mock/tu-ruta en tu agente de IA o cliente HTTP. Respuesta instantánea.", icon: <Play size={20} /> }
];

const COMPARISON_DATA = [
  { feature: "Precio Pro", mockagent: "$4.99/mes", beeceptor: "12$/mes", postman: "14$/mes" },
  { feature: "Sin tarjeta para empezar", mockagent: "✅", beeceptor: "❌", postman: "❌" },
  { feature: "Respuestas JSON custom", mockagent: "✅", beeceptor: "✅", postman: "✅" },
  { feature: "Rate limiting por plan", mockagent: "✅", beeceptor: "❌", postman: "❌" },
  { feature: "Retención de logs por plan", mockagent: "✅", beeceptor: "❌", postman: "❌" },
  { feature: "Código abierto", mockagent: "Próximamente", beeceptor: "❌", postman: "❌" },
  { feature: "Auto-alojable", mockagent: "✅", beeceptor: "❌", postman: "❌" }
];

const COMPARE_COMPETITORS = [
  {
    name: "Beeceptor",
    slug: "beeceptor",
    description: "Beeceptor es un servicio de mocking en la nube. MockAgent ofrece una alternativa auto-alojable con control total.",
    data: [
      { feature: "Precio Pro", mockagent: "$4.99/mes", competitor: "12$/mes", winner: "mockagent" },
      { feature: "Auto-alojable", mockagent: "✅ On-premise", competitor: "❌ Solo cloud", winner: "mockagent" },
      { feature: "Rate limiting", mockagent: "✅ Configurable", competitor: "❌ No", winner: "mockagent" },
      { feature: "Open Source", mockagent: "✅ Próximamente", competitor: "❌ Cerrado", winner: "mockagent" },
      { feature: "Sin tarjeta", mockagent: "✅ Free forever", competitor: "❌ Requiere tarjeta", winner: "mockagent" },
      { feature: "Logs", mockagent: "7 días (Pro)", competitor: "15 días (Team)", winner: "empate" },
    ]
  },
  {
    name: "Postman",
    slug: "postman",
    description: "Postman es una suite completa de APIs. Para mocking, MockAgent es más específico y económico.",
    data: [
      { feature: "Precio Pro", mockagent: "$4.99/mes", competitor: "14$/mes", winner: "mockagent" },
      { feature: "Enfoque", mockagent: "Mocking puro", competitor: "Suite completa", winner: "mockagent" },
      { feature: "Auto-alojable", mockagent: "✅", competitor: "❌", winner: "mockagent" },
      { feature: "Curva de aprendizaje", mockagent: "Baja", competitor: "Alta", winner: "mockagent" },
      { feature: "Vibe Coding", mockagent: "✅ Optimizado", competitor: "❌", winner: "mockagent" },
      { feature: "Setup", mockagent: "30 segundos", competitor: "Minutos", winner: "mockagent" },
    ]
  },
  {
    name: "WireMock",
    slug: "wiremock",
    description: "WireMock es una librería Java. Requiere código para configurar. MockAgent es visual y sin código.",
    data: [
      { feature: "Curva de aprendizaje", mockagent: "Baja", competitor: "Alta", winner: "mockagent" },
      { feature: "UI Visual", mockagent: "✅ Dashboard", competitor: "❌ JSON/config", winner: "mockagent" },
      { feature: "Setup", mockagent: "Docker Compose", competitor: "Java + código", winner: "mockagent" },
      { feature: "Precio", mockagent: "$4.99/mes", competitor: "Gratis (self-hosted)", winner: "empate" },
      { feature: "Cloud", mockagent: "✅ Cloud + Self-hosted", competitor: "❌ Solo local", winner: "mockagent" },
      { feature: "Rate limiting", mockagent: "✅", competitor: "❌ Manual", winner: "mockagent" },
    ]
  },
  {
    name: "Broadcom DevTest",
    slug: "broadcom",
    description: "Broadcom DevTest es una suite enterprise. MockAgent es una alternativa ágil y económica.",
    data: [
      { feature: "Precio", mockagent: "$4.99/mes", competitor: "Enterprise (€€€)", winner: "mockagent" },
      { feature: "Setup", mockagent: "30 segundos", competitor: "Semanas", winner: "mockagent" },
      { feature: "Enfoque", mockagent: "Dev/Prototipo", competitor: "Enterprise", winner: "mockagent" },
      { feature: "Open Source", mockagent: "✅", competitor: "❌", winner: "mockagent" },
      { feature: "Sin tarjeta", mockagent: "✅", competitor: "❌", winner: "mockagent" },
      { feature: "Auto-alojable", mockagent: "✅", competitor: "✅", winner: "empate" },
    ]
  },
  {
    name: "Mockbin",
    slug: "mockbin",
    description: "Mockbin es una herramienta simple. MockAgent ofrece más funcionalidades y persistencia.",
    data: [
      { feature: "Retención logs", mockagent: "7 días (Pro)", competitor: "Limitado", winner: "mockagent" },
      { feature: "Rate limiting", mockagent: "✅", competitor: "❌", winner: "mockagent" },
      { feature: "Persistencia", mockagent: "✅ MySQL", competitor: "❌ Volátil", winner: "mockagent" },
      { feature: "JWT Auth", mockagent: "✅", competitor: "❌", winner: "mockagent" },
      { feature: "Planes", mockagent: "Free + Pro", competitor: "Solo básico", winner: "mockagent" },
      { feature: "Auto-alojable", mockagent: "✅", competitor: "✅", winner: "empate" },
    ]
  },
  {
    name: "Apidog",
    slug: "apidog",
    description: "Apidog es para documentación de APIs. MockAgent se enfoca específicamente en mocking.",
    data: [
      { feature: "Enfoque", mockagent: "Mocking puro", competitor: "Docs + Mock", winner: "mockagent" },
      { feature: "Precio", mockagent: "$4.99/mes", competitor: "15$/mes", winner: "mockagent" },
      { feature: "Rate limiting", mockagent: "✅", competitor: "❌", winner: "mockagent" },
      { feature: "JWT", mockagent: "✅", competitor: "❌", winner: "mockagent" },
      { feature: "Vibe Coding", mockagent: "✅", competitor: "❌", winner: "mockagent" },
      { feature: "Auto-alojable", mockagent: "✅", competitor: "❌", winner: "mockagent" },
    ]
  },
];

const TESTIMONIALS = [
  { name: "Carlos R.", role: "Lead Dev @ FintechXYZ", text: "MockAgent nos permitió testear nuestro agente de trading sin gastar 200€ en llamadas reales a la API de Binance. El rate limiting por plan es oro puro.", avatar: "CR" },
  { name: "Elena M.", role: "CTO @ AgentiaLabs", text: "En 10 minutos teníamos mocks de 12 endpoints de nuestro CRM. El dashboard de logs nos salvó horas de debugging.", avatar: "EM" },
  { name: "Diego S.", role: "Freelance Full-Stack", text: "Uso la versión Free para todos mis side-projects. 5 endpoints y 100 peticiones diarias son más que suficientes para prototipar.", avatar: "DS" }
];

const FAQ_ITEMS = [
  { q: "¿Necesito tarjeta de crédito para empezar?", a: "No. El plan Free es gratuito para siempre y no requiere tarjeta. Regístrate con tu email y empieza a crear mocks inmediatamente." },
  { q: "¿Qué pasa si supero las 100 peticiones diarias del plan Free?", a: "Recibirás un error 429 (Too Many Requests). Puedes esperar al día siguiente para que el contador se reinicie, o upgrade a Pro ($4.99/mes) con 5.000 peticiones/día." },
  { q: "¿Puedo exportar mis mocks?", a: "Próximamente añadiremos exportación a JSON y OpenAPI Specification desde el dashboard. De momento puedes copiar la configuración manualmente." },
  { q: "¿Es seguro? ¿Quién puede ver mis endpoints?", a: "Cada usuario solo ve sus propios endpoints y logs. La autenticación usa JWT y los datos se almacenan en tu propia instancia de base de datos. Nadie más tiene acceso." },
  { q: "¿Puedo usar MockAgent en producción?", a: "MockAgent está diseñado para desarrollo, testing y staging. No recomendamos usarlo como backend de producción real, aunque la arquitectura soporta carga considerable." },
  { q: "¿Puedo cancelar el plan Pro cuando quiera?", a: "Sí. No hay permanencia. Desde tu perfil puedes cancelar en cualquier momento. Sin penalizaciones ni preguntas." }
];

const DOCS_SECTIONS = [
  {
    id: 'intro',
    title: 'Introducción',
    content: 'Base URL: https://tfg-mockagent-production.up.railway.app. Todas las rutas administrativas requieren autenticación via JWT Bearer token en el header Authorization. El mock server (/mock/**) es público una vez publicado el endpoint.'
  },
  {
    id: 'auth',
    title: 'Autenticación',
    endpoints: [
      { method: 'POST', path: '/api/auth/signup', desc: 'Crear cuenta', body: '{"email":"user@test.com","password":"secret"}', response: '{"token":"eyJ...","plan":"starter"}' },
      { method: 'POST', path: '/api/auth/login', desc: 'Iniciar sesión', body: '{"email":"user@test.com","password":"secret"}', response: '{"token":"eyJ...","plan":"starter"}' },
      { method: 'GET', path: '/api/auth/profile', desc: 'Ver perfil', auth: true, response: '{"email":"user@test.com","plan":"starter","endpointCount":3}' },
      { method: 'POST', path: '/api/auth/upgrade', desc: 'Upgrade a Pro', auth: true, response: '{"email":"user@test.com","plan":"pro","endpointCount":3}' }
    ]
  },
  {
    id: 'admin',
    title: 'Gestión de Endpoints',
    endpoints: [
      { method: 'GET', path: '/admin/endpoints', desc: 'Listar mis mocks', auth: true, response: '[{"id":1,"path":"/api/users","method":"GET","status":200}]' },
      { method: 'POST', path: '/admin/endpoints', desc: 'Crear mock', auth: true, body: '{"path":"/api/users","method":"GET","status":200,"responseBody":"{\\"users\\":[]}"}', response: '{"id":1,"path":"/api/users","method":"GET","status":200}' },
      { method: 'PUT', path: '/admin/endpoints/{id}', desc: 'Editar mock', auth: true, body: '{"path":"/api/users","method":"GET","status":200,"responseBody":"{\\"users\\":[]}"}', response: '{"id":1,"path":"/api/users","method":"GET","status":200}' },
      { method: 'DELETE', path: '/admin/endpoints/{id}', desc: 'Borrar mock', auth: true, response: '{"message":"Endpoint eliminado"}' },
      { method: 'GET', path: '/admin/logs', desc: 'Ver logs de peticiones', auth: true, response: '[{"id":1,"timestamp":"2026-06-06T10:00:00","method":"GET","path":"/api/users","statusCode":200}]' }
    ]
  },
  {
    id: 'mock',
    title: 'Mock Server',
    endpoints: [
      { method: 'ANY', path: '/mock/**', desc: 'Llamar a un mock publicado. Reemplaza /** por la ruta configurada.', auth: false, response: 'El responseBody configurado en el endpoint' }
    ]
  },
  {
    id: 'limits',
    title: 'Límites por Plan',
    table: [
      { plan: 'Free', daily: '100 req/día', minute: '100 req/min', logs: '24 horas', endpoints: '5' },
      { plan: 'Pro', daily: '5.000 req/día', minute: '1.000 req/min', logs: '7 días', endpoints: 'Ilimitados' },
      { plan: 'Premium', daily: '10.000 req/día', minute: '1.500 req/min', logs: '14 días', endpoints: 'Ilimitados' }
    ]
  },
  {
    id: 'errors',
    title: 'Códigos de Error',
    codes: [
      { code: '400', desc: 'Bad Request. JSON inválido o campos obligatorios ausentes.' },
      { code: '401', desc: 'Unauthorized. Token JWT inválido, expirado o ausente.' },
      { code: '403', desc: 'Forbidden. Límite de plan excedido (endpoints o rate limit).' },
      { code: '404', desc: 'Not Found. Endpoint no encontrado para esa ruta y método.' },
      { code: '429', desc: 'Too Many Requests. Rate limit diario o por minuto excedido.' },
      { code: '500', desc: 'Internal Server Error. Error inesperado del servidor.' }
    ]
  }
];

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Por qué tu agente de IA necesita mocks antes de tocar APIs reales',
    date: '15 Mayo 2026',
    readTime: '4 min',
    excerpt: 'Desarrollar un agente de IA que consume APIs externas es costoso. Cada llamada de prueba genera costes, rate limits y dependencias de terceros.',
    content: 'Cuando construyes un agente autónomo que interactúa con APIs externas, el ciclo de desarrollo se ralentiza drásticamente. Cada petición de prueba consume créditos, expone tu aplicación a rate limits agresivos y crea dependencias con servicios que pueden estar caídos.\n\nCon MockAgent, simulas esas respuestas en milisegundos sin salir de tu entorno local. Puedes testar escenarios de error (500, 429, timeouts) sin arriesgar tu presupuesto ni depender de la disponibilidad de terceros.\n\nEl resultado: iteraciones más rápidas, tests más fiables y un agente robusto antes de tocar producción.'
  },
  {
    id: 2,
    title: 'Cómo reducir un 65% los costes de desarrollo con mocking',
    date: '22 Mayo 2026',
    readTime: '5 min',
    excerpt: 'Hicimos los números: un equipo de 3 devs haciendo 200 llamadas diarias a una API de pago durante 3 meses gasta más de 600€.',
    content: 'Imagina un equipo de 3 desarrolladores trabajando en un agente de IA durante 3 meses. Si cada dev hace 200 llamadas diarias a una API de pago (0,01€/llamada), el coste asciende a 540€ solo en desarrollo.\n\nCon MockAgent, esas 200 llamadas diarias son gratis. El plan Free cubre 100 peticiones/día por usuario (300 en total), suficientes para prototipar. Al pasar a Pro ($4.99/mes), el equipo tiene 5.000 peticiones diarias por $14.97/mes en total.\n\nDe 540€ a $44.91 en 3 meses. Un ahorro del 92%, sin contar el tiempo ahorrado en esperas y debugging.'
  },
  {
    id: 3,
    title: 'Rate limiting en mocks: por qué importa para el testing de agentes',
    date: '1 Junio 2026',
    readTime: '3 min',
    excerpt: '¿Por qué el plan Free tiene 100 peticiones diarias? No es capricho: simula los rate limits reales de las APIs de producción.',
    content: 'Una API bien diseñada implementa rate limiting para proteger su infraestructura. Cuando tu agente de IA las consume, debe manejar errores 429 (Too Many Requests) de forma elegante.\n\nMockAgent replica ese comportamiento. El plan Free (100 req/día) obliga a tu agente a implementar backoffs, reintentos y caching desde el primer día. Cuando pases a Pro (5.000 req/día) o a APIs reales, tu código ya estará preparado.\n\nEs un gimnasio para tu agente: entrena con peso ligero para levantar peso pesado en producción.'
  }
];

const PRIVACY_TEXT = `Política de Privacidad de MockAgent

1. Datos que recogemos
Registro: dirección de email y hash de contraseña (bcrypt).
Actividad: endpoints creados, logs de peticiones recibidas y preferencia de tema visual.
No almacenamos datos de tarjetas de crédito ni información de pago (en esta versión académica, los pagos son simulados).

2. Dónde se almacenan
Los datos se guardan en una instancia de base de datos MySQL propia del usuario (auto-alojada) o en el entorno local de desarrollo. No utilizamos servidores de terceros para persistencia.

3. Quién tiene acceso
Solo el usuario autenticado mediante JWT (JSON Web Token) puede acceder a sus endpoints y logs. No existe acceso compartido ni multi-usuario en la versión actual.

4. Cookies y almacenamiento local
Utilizamos localStorage y sessionStorage para:
- Guardar el token de autenticación JWT (con opción "Recuérdame").
- Recordar la preferencia de tema oscuro/claro.
No utilizamos cookies de terceros ni scripts de tracking.

5. Compartición con terceros
MockAgent no comparte, vende ni transfiere datos personales a terceros. Los datos permanecen en tu instancia local.

6. Derechos del usuario
Puedes solicitar la eliminación completa de tu cuenta y todos los datos asociados contactando a mockagentai@gmail.com. En la versión actual, también puedes borrar manualmente tus endpoints desde el dashboard.

7. Seguridad
Autenticación JWT con expiración de 24 horas.
Contraseñas hasheadas con bcrypt.
Aislamiento completo de datos entre usuarios.

8. Cambios en esta política
Cualquier modificación será notificada en esta página. La fecha de última actualización es 6 de junio de 2026.

Contacto: mockagentai@gmail.com`;

const TERMS_TEXT = `Términos de Servicio de MockAgent

1. Descripción del servicio
MockAgent es una plataforma de mocking de APIs para desarrollo, testing y staging de agentes de inteligencia artificial. Permite crear endpoints simulados, configurar respuestas JSON y monitorizar peticiones.

2. Uso permitido
Puedes utilizar MockAgent para:
- Prototipar y testar agentes de IA.
- Simular respuestas de APIs externas durante el desarrollo.
- Educación e investigación académica.

3. Uso prohibido
Queda estrictamente prohibido utilizar MockAgent para:
- Actividades ilegales, fraudulentas o malintencionadas.
- Distribuir malware, spam o contenido dañino.
- Realizar ataques de denegación de servicio (DDoS) contra la infraestructura.
- Violar los derechos de propiedad intelectual de terceros.

4. Limitaciones y descargo de responsabilidad
MockAgent es una infraestructura de mocking profesional para equipos de desarrollo de IA.
NO ofrecemos garantía de disponibilidad (SLA), uptime ni soporte 24/7.
NO está diseñado para uso en producción como backend principal.
El uso es bajo tu propia responsabilidad.

5. Propiedad intelectual
Tú eres propietario de los endpoints, rutas y respuestas JSON que configures. MockAgent no reclama derechos sobre tu contenido.
El código fuente de MockAgent (próximamente open source) estará bajo licencia MIT.

6. Planes y pagos
En esta versión académica, los pagos son simulados. El upgrade a Pro se realiza desde el dashboard sin procesamiento real de tarjetas.

7. Cancelación
Puedes dejar de utilizar el servicio en cualquier momento. El borrado de cuenta elimina todos tus datos de la base de datos.

8. Modificaciones de los términos
Nos reservamos el derecho de actualizar estos términos. Los cambios entrarán en vigor al publicarse en esta página.

9. Ley aplicable
Estos términos se rigen por la legislación española.

10. Contacto
Para cualquier consulta legal o de privacidad, escríbenos a mockagentai@gmail.com.

Fecha de vigencia: 6 de junio de 2026.`;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

const overlayAnim = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalAnim = {
  hidden: { opacity: 0, scale: 0.92, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
};

const getMethodBadge = (method) => {
  const m = method.toUpperCase();
  if (m === 'GET') return 'badge-get';
  if (m === 'POST') return 'badge-post';
  if (m === 'PUT') return 'badge-put';
  if (m === 'DELETE') return 'badge-delete';
  return '';
};

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} style={{ borderBottom: '1px solid var(--border-color)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontSize: '15px', fontWeight: '600', textAlign: 'left' }}>
        {question}
        <span style={{ color: '#C9A96E', transition: '0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}><ChevronDown size={18} /></span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <p style={{ padding: '0 0 20px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function App() {
  const [endpoints, setEndpoints] = useState([]);
  const [path, setPath] = useState('');
  const [method, setMethod] = useState('GET');
  const [status, setStatus] = useState('200');
  const [responseBody, setResponseBody] = useState('{}');
  const [vistaActual, setVistaActual] = useState('landing');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [fullName, setFullName] = useState(() => localStorage.getItem('fullName') || sessionStorage.getItem('fullName') || '');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || sessionStorage.getItem('userName') || '');
  const [isAnnual, setIsAnnual] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') !== 'light');
  const [userPlan, setUserPlan] = useState(getUserPlan() || '');
  const [rememberMe, setRememberMe] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);
  const [mostrarPopupLogin, setMostrarPopupLogin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupInicialCerrado, setPopupInicialCerrado] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [modal, setModal] = useState({ open: false, type: '', title: '', message: '', onConfirm: null });
  const closeModal = () => setModal({ open: false, type: '', title: '', message: '', onConfirm: null });
  const [modalInput, setModalInput] = useState('');

  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  // API Status indicator
  const [apiStatus, setApiStatus] = useState('online');

  // Publish check animation
  const [showPublishCheck, setShowPublishCheck] = useState(false);

  // Scroll progress & back to top
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Currency selector
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  // Loading states
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const [isLoadingPublish, setIsLoadingPublish] = useState(false);

  // Instant Mock
  const [instantName, setInstantName] = useState('');
  const [instantResult, setInstantResult] = useState(null);
  const [instantLoading, setInstantLoading] = useState(false);
  const [instantError, setInstantError] = useState('');

  const [logs, setLogs] = useState([]);
  const cargarLogs = async () => {
    try {
      const r = await API.get('/admin/logs');
      setLogs(Array.isArray(r.data) ? r.data : []);
    } catch (e) { console.error("Error al cargar logs:", e); setLogs([]); }
  };

  const [editingId, setEditingId] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  useEffect(() => {
    document.documentElement.className = isDarkMode ? '' : 'light';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Reset scroll to top on every navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [vistaActual]);

  // Scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowScrollButton(scrollTop > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // API status checker
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await API.get('/api/auth/logout');
        setApiStatus('online');
      } catch {
        setApiStatus('offline');
      }
    };
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyDropdownOpen && !event.target.closest('.currency-dropdown')) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [currencyDropdownOpen]);

  const hasLoggedInBefore = localStorage.getItem('hasLoggedInBefore');

  useEffect(() => {
    // Si hay token activo (localStorage o sessionStorage), nunca mostrar popup
    if (getToken()) {
      setMostrarPopupLogin(false);
      return;
    }
    if (vistaActual === 'dashboard') { setMostrarPopupLogin(false); return; }
    if (vistaActual === 'landing' && !popupInicialCerrado) {
      const t = setTimeout(() => setMostrarPopupLogin(true), 1000);
      return () => clearTimeout(t);
    }
    const intervalo = setInterval(() => { if (vistaActual === 'landing' && !getToken()) setMostrarPopupLogin(true); }, 120000);
    return () => clearInterval(intervalo);
  }, [vistaActual, popupInicialCerrado]);

  const getPrice = (plan) => {
    if (typeof plan.price.monthly === "string") return plan.price.monthly;
    const price = isAnnual ? plan.price.annual : plan.price.monthly;
    const currency = CURRENCIES.find(c => c.code === selectedCurrency);
    const converted = price * currency.rate;
    return { value: converted.toFixed(2), symbol: currency.symbol, code: currency.code };
  };

  const getAnnualBilling = (plan) => {
    if (!plan.annualBilling) return null;
    const currency = CURRENCIES.find(c => c.code === selectedCurrency);
    const converted = plan.annualBilling * currency.rate;
    return { value: converted.toFixed(2), symbol: currency.symbol, code: currency.code };
  };

  const cargarEndpoints = async () => {
    try {
      const r = await API.get('/admin/endpoints');
      setEndpoints(Array.isArray(r.data) ? r.data : []);
    } catch (e) { console.error("Error al cargar mocks:", e); setEndpoints([]); }
  };

  useEffect(() => { if (vistaActual === 'dashboard') { cargarEndpoints(); cargarLogs(); } }, [vistaActual]);

  const manejarRegistro = async (e) => {
    e.preventDefault(); setMensajeError(''); setIsLoadingSignup(true);
    try {
      const r = await API.post('/api/auth/signup', { email: usuario, password: password });
      if (r.status === 201) {
        setToken(r.data.token, rememberMe);
        saveUserPlan(r.data.plan, rememberMe);
        saveUserEmail(usuario, rememberMe);
        const initialName = usuario.split('@')[0];
        saveFullName(initialName, rememberMe);
        saveUserName(initialName, rememberMe);
        setFullName(initialName);
        setUserName(initialName);
        setUserPlan(r.data.plan);
        localStorage.setItem('hasLoggedInBefore', 'true');
        showToast('¡Cuenta creada con éxito!');
        if (pendingPlan) {
          const planToCheckout = pendingPlan;
          setPendingPlan(null);
          await iniciarCheckout(planToCheckout);
        } else {
          setVistaActual('dashboard');
        }
      }
    } catch (e) { setMensajeError(e.response?.data?.message || 'Error en el servidor.'); }
    setIsLoadingSignup(false);
  };

  const manejarLogin = async (e) => {
    e.preventDefault(); setMensajeError(''); setIsLoadingLogin(true);
    try {
      const r = await API.post('/api/auth/login', { email: usuario, password: password });
      if (r.status === 200) {
        setToken(r.data.token, rememberMe);
        saveUserPlan(r.data.plan, rememberMe);
        saveUserEmail(usuario, rememberMe);
        const existingName = localStorage.getItem('fullName') || sessionStorage.getItem('fullName');
        const existingUser = localStorage.getItem('userName') || sessionStorage.getItem('userName');
        if (!existingName) {
          const initialName = usuario.split('@')[0];
          saveFullName(initialName, rememberMe);
          setFullName(initialName);
        }
        if (!existingUser) {
          const initialUser = usuario.split('@')[0];
          saveUserName(initialUser, rememberMe);
          setUserName(initialUser);
        }
        setUserPlan(r.data.plan);
        localStorage.setItem('hasLoggedInBefore', 'true');
        setPassword('');
        showToast('¡Bienvenido de nuevo!');
        if (pendingPlan) {
          const planToCheckout = pendingPlan;
          setPendingPlan(null);
          await iniciarCheckout(planToCheckout);
        } else {
          setVistaActual('dashboard');
        }
      }
    } catch (e) { setMensajeError(e.response?.data?.message || 'Credenciales no válidas.'); }
    setIsLoadingLogin(false);
  };

  const manejarGoogleLogin = async (credentialResponse) => {
    setMensajeError(''); setIsLoadingLogin(true);
    try {
      const r = await API.post('/api/auth/google', { idToken: credentialResponse.credential });
      if (r.status === 200) {
        setToken(r.data.token, rememberMe);
        saveUserPlan(r.data.plan, rememberMe);
        saveUserEmail(r.data.email, rememberMe);
        const existingNameGoogle = localStorage.getItem('fullName') || sessionStorage.getItem('fullName');
        const existingUserGoogle = localStorage.getItem('userName') || sessionStorage.getItem('userName');
        if (!existingNameGoogle) {
          const initialNameGoogle = r.data.email.split('@')[0];
          saveFullName(initialNameGoogle, rememberMe);
          setFullName(initialNameGoogle);
        }
        if (!existingUserGoogle) {
          const initialUserGoogle = r.data.email.split('@')[0];
          saveUserName(initialUserGoogle, rememberMe);
          setUserName(initialUserGoogle);
        }
        setUserPlan(r.data.plan);
        localStorage.setItem('hasLoggedInBefore', 'true');
        showToast('¡Bienvenido! Sesión iniciada con Google.');
        if (pendingPlan) {
          const planToCheckout = pendingPlan;
          setPendingPlan(null);
          await iniciarCheckout(planToCheckout);
        } else {
          setVistaActual('dashboard');
        }
      }
    } catch (e) { setMensajeError(e.response?.data?.message || 'Error al iniciar sesión con Google.'); }
    setIsLoadingLogin(false);
  };

  const isValidJson = (str) => {
    try { JSON.parse(str); return true; } catch { return false; }
  };

  const validarPassword = (pwd) => {
    return {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/.test(pwd),
    };
  };

  const iniciarCheckout = async (planId) => {
    try {
      const currentEmail = getUserEmail();
      const r = await API.post('/api/stripe/checkout', { plan: planId, email: currentEmail });
      if (r.data.url) {
        window.location.href = r.data.url;
      }
    } catch (e) {
      console.error('Stripe checkout error:', e.response?.data);
      const errorMsg = e.response?.data?.error || e.response?.data?.message || 'Error al iniciar el checkout';
      showToast(errorMsg, 'error');
    }
  };

  const publicarMock = async (e) => {
    e.preventDefault();
    if (!isValidJson(responseBody)) {
      showToast('El Response Body no es un JSON válido', 'error');
      return;
    }
    setIsLoadingPublish(true);
    try {
      if (editingId) {
        await API.put(`/admin/endpoints/${editingId}`, { path, method, status: parseInt(status), responseBody });
        setEditingId(null);
        showToast('Endpoint actualizado correctamente');
      } else {
        await API.post('/admin/endpoints', { path, method, status: parseInt(status), responseBody });
        showToast('Endpoint publicado correctamente');
      }
      setShowPublishCheck(true);
      setTimeout(() => setShowPublishCheck(false), 2000);
      setPath('');
      setResponseBody('{}');
      cargarEndpoints();
      cargarLogs();
    } catch (e) {
      const msg = e.response?.data?.message || 'Error al guardar el endpoint.';
      if (msg.toLowerCase().includes('límite') || msg.toLowerCase().includes('limit')) {
        setModal({ open: true, type: 'limit', title: 'Límite alcanzado', message: msg, onConfirm: closeModal });
      } else {
        showToast(msg, 'error');
      }
      console.error(e);
    }
    setIsLoadingPublish(false);
  };

  const empezarEdicion = (ep) => {
    setEditingId(ep.id);
    setPath(ep.path);
    setMethod(ep.method);
    setStatus(String(ep.status));
    setResponseBody(ep.responseBody || '{}');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setPath('');
    setMethod('GET');
    setStatus('200');
    setResponseBody('{}');
  };

  const borrarMock = (id) => {
    setModal({
      open: true,
      type: 'delete',
      title: 'Eliminar endpoint',
      message: '¿Seguro que quieres eliminar este contrato de API? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        closeModal();
        try {
          await API.delete(`/admin/endpoints/${id}`);
          cargarEndpoints();
        } catch (e) {
          console.error(e);
          setModal({ open: true, type: 'error', title: 'Error', message: 'No se pudo borrar el mock.', onConfirm: closeModal });
        }
      }
    });
  };

  const crearInstantMock = async () => {
    if (!instantName.trim()) return;
    setInstantLoading(true);
    setInstantError('');
    setInstantResult(null);
    try {
      const r = await API.post('/api/instant/create', { name: instantName.trim() });
      setInstantResult(r.data);
    } catch (e) {
      setInstantError(e.response?.data?.message || 'Error al crear el mock instantáneo.');
    }
    setInstantLoading(false);
  };

  const cerrarSesion = () => {
    removeToken();
    removeUserPlan();
    removeUserEmail();
    setUsuario('');
    setPassword('');
    setUserPlan('');
    setEndpoints([]);
    setLogs([]);
    setVistaActual('landing');
  };

  const ThemeToggle = () => (
    <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: '#1e1e45', border: '1px solid rgba(201,169,110,0.35)', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}>
      <span style={{ color: '#C9A96E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isDarkMode ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
      </span>
    </button>
  );

  const NAVBAR_STYLE = {
    position: 'sticky', top: 0, zIndex: 50,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 16px',
    flexWrap: 'wrap',
    gap: '8px',
    background: 'var(--nav-bg)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--nav-border)'
  };

  const CTA_PRIMARY = {
    backgroundColor: '#C9A96E', color: '#0a0a1e', border: 'none', padding: '10px 20px',
    borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
    boxShadow: 'var(--gold-glow-strong)', transition: '0.2s'
  };

  const CTA_SECONDARY = {
    backgroundColor: 'transparent', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.2)',
    padding: '10px 20px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '14px', transition: '0.2s'
  };

  function renderVista() {
    // ==========================================
    //            VISTA 1: LANDING
    // ==========================================
    if (vistaActual === 'landing') {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', fontFamily: 'var(--font-main)', display: 'flex', flexDirection: 'column' }}>

        {/* NAVBAR */}
        <nav style={NAVBAR_STYLE}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.svg" alt="MockAgent" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>MOCK<span style={{ color: '#C9A96E' }}>AGENT</span>.AI</span>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: 'none', gap: '12px', alignItems: 'center' }} className="desktop-nav">
            <motion.button onClick={() => setVistaActual('pricing')} whileHover={{ scale: 1.04, backgroundColor: 'rgba(201,169,110,0.15)' }} whileTap={{ scale: 0.97 }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(201,169,110,0.3)', backgroundColor: 'transparent', color: '#C9A96E', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Pricing</motion.button>
            {getToken() ? (
              <>
                <motion.button onClick={() => { setVistaActual('dashboard'); }} whileHover={{ scale: 1.04, backgroundColor: '#D4B87A' }} whileTap={{ scale: 0.97 }} style={CTA_PRIMARY}>Mi cuenta</motion.button>
                <motion.button onClick={cerrarSesion} whileHover={{ scale: 1.04, backgroundColor: 'rgba(239,68,68,0.9)' }} whileTap={{ scale: 0.97 }} style={{ ...CTA_SECONDARY, border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>Cerrar sesión</motion.button>
              </>
            ) : (
              <>
                <span onClick={() => setVistaActual('login')} style={{ cursor: 'pointer', fontWeight: '500', fontSize: '14px', color: 'var(--text-muted)', transition: '0.2s' }}>Login</span>
                <motion.button onClick={() => setVistaActual('signup')} whileHover={{ scale: 1.04, backgroundColor: '#D4B87A' }} whileTap={{ scale: 0.97 }} style={CTA_PRIMARY}>Empezar Gratis</motion.button>
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="mobile-nav">
            <ThemeToggle />
            {getToken() && (
              <button
                onClick={() => setVistaActual('dashboard')}
                style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <User size={20} />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                width: '36px', height: '36px', borderRadius: '8px',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                backgroundColor: 'var(--card-bg)',
                borderBottom: '1px solid var(--border-color)',
                overflow: 'hidden',
                zIndex: 49
              }}
              className="mobile-menu-dropdown"
            >
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span onClick={() => { setVistaActual('pricing'); setMobileMenuOpen(false); }} style={{ cursor: 'pointer', fontWeight: '500', fontSize: '15px', color: 'var(--text-muted)', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>Pricing</span>
                {getToken() ? (
                  <>
                    <span onClick={() => { setVistaActual('dashboard'); setMobileMenuOpen(false); }} style={{ cursor: 'pointer', fontWeight: '500', fontSize: '15px', color: 'var(--text-muted)', padding: '8px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> Mi cuenta</span>
                    <span onClick={() => { cerrarSesion(); setMobileMenuOpen(false); }} style={{ cursor: 'pointer', fontWeight: '500', fontSize: '15px', color: '#ef4444', padding: '8px 0' }}>Cerrar sesión</span>
                  </>
                ) : (
                  <>
                    <span onClick={() => { setVistaActual('login'); setMobileMenuOpen(false); }} style={{ cursor: 'pointer', fontWeight: '500', fontSize: '15px', color: 'var(--text-muted)', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>Login</span>
                    <motion.button onClick={() => { setVistaActual('signup'); setMobileMenuOpen(false); }} whileTap={{ scale: 0.97 }} style={{ ...CTA_PRIMARY, width: '100%', marginTop: '8px' }}>Empezar Gratis</motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO */}
        <section style={{ position: 'relative', overflow: 'hidden', flex: '1 0 auto' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.06) 0%, transparent 60%)' }} />
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '1024px', margin: '0 auto', textAlign: 'center', padding: '48px 16px 48px' }}>
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '9999px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#C9A96E', backgroundColor: 'rgba(201,169,110,0.05)', marginBottom: '28px' }}>
                  <Zap size={14} /> Infraestructura de mocking para equipos modernos
                </span>
              </motion.div>
              <motion.h1 variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }} style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: '800', letterSpacing: '-2px', lineHeight: '1.1', marginBottom: '24px', maxWidth: '800px', margin: '0 auto 24px' }}>
                Prueba tus Agentes de IA en un{' '}<span className="gold-shimmer">Entorno Aislado y Profesional.</span>
              </motion.h1>
              <motion.p variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }} style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '672px', margin: '0 auto 44px', lineHeight: '1.7' }}>
                Crea contratos de API en segundos, simula respuestas JSON y escala tu desarrollo de IA sin depender de servidores externos.
              </motion.p>
              <motion.div variants={fadeUp} transition={{ duration: 0.6, delay: 0.3 }} style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <motion.button onClick={() => setVistaActual('signup')} whileHover={{ scale: 1.04, backgroundColor: '#D4B87A' }} whileTap={{ scale: 0.97 }} style={{ ...CTA_PRIMARY, padding: '16px 32px', fontSize: '16px', borderRadius: '12px' }}>
                  Crear Perfil Gratis
                </motion.button>
                <motion.button onClick={() => setVistaActual('pricing')} whileHover={{ scale: 1.04, backgroundColor: 'rgba(201,169,110,0.05)' }} whileTap={{ scale: 0.97 }} style={{ ...CTA_SECONDARY, padding: '16px 32px', fontSize: '16px', borderRadius: '12px' }}>
                  Ver Planes
                </motion.button>
              </motion.div>
            </motion.div>

            {/* STATS BAR */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '24px', maxWidth: '672px', margin: '48px auto 0' }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#C9A96E' }}>{s.value}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* INSTANT MOCK - Express Creation */}
        <section style={{ padding: '96px 24px', borderTop: '1px solid var(--border-color)', background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.02) 0%, transparent 50%)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
              <motion.span variants={fadeUp} style={{ display: 'inline-block', color: '#C9A96E', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px', marginBottom: '12px' }}>
                <Zap size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Instant Mock
              </motion.span>
              <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '16px' }}>
                Prueba MockAgent al instante
              </motion.h2>
              <motion.p variants={fadeUp} style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                Crea un endpoint de prueba en segundos. Sin registro, sin tarjeta.
              </motion.p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
              style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <input
                type="text"
                value={instantName}
                onChange={(e) => setInstantName(e.target.value)}
                placeholder="Nombre de tu API (ej: mi-api)"
                onKeyPress={(e) => e.key === 'Enter' && crearInstantMock()}
                style={{
                  padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '15px',
                  minWidth: '280px', flex: '1', maxWidth: '400px', outline: 'none'
                }}
              />
              <motion.button
                onClick={crearInstantMock}
                disabled={instantLoading}
                whileHover={{ scale: 1.04, backgroundColor: '#D4B87A' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  ...CTA_PRIMARY, padding: '14px 28px', fontSize: '15px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', gap: '8px', opacity: instantLoading ? 0.7 : 1,
                  cursor: instantLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {instantLoading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creando...</> : <><Zap size={18} /> Crear Mock Express</>}
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {instantError && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{ marginTop: '24px', padding: '14px 18px', borderRadius: '12px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '14px', display: 'inline-block' }}
                >
                  {instantError}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {instantResult && (
                <motion.div initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ marginTop: '32px', backgroundColor: 'var(--card-bg-50)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(201,169,110,0.2)', textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <CheckCircle size={20} color="#10b981" />
                    <span style={{ fontWeight: '600', fontSize: '15px' }}>¡Mock creado con éxito!</span>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500' }}>ENDPOINT GENERADO</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-color)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <code style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: '#C9A96E' }}>{instantResult.url}</code>
                      <button onClick={() => { navigator.clipboard.writeText(instantResult.url); showToast('URL copiada'); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }} title="Copiar URL">
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500' }}>CURL EXAMPLE</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-color)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--text-main)' }}>
                      <code style={{ flex: 1, overflowX: 'auto' }}>{instantResult.curlExample}</code>
                      <button onClick={() => { navigator.clipboard.writeText(instantResult.curlExample); showToast('CURL copiado'); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }} title="Copiar CURL">
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section style={{ padding: '96px 24px', borderTop: '1px solid var(--border-color)', background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.02) 0%, transparent 50%)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} style={{ textAlign: 'center', marginBottom: '64px' }}>
              <motion.span variants={fadeUp} style={{ display: 'inline-block', color: '#C9A96E', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px', marginBottom: '12px' }}>Flujo de trabajo</motion.span>
              <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800', letterSpacing: '-0.5px' }}>De la idea al mock en 3 pasos</motion.h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {HOW_IT_WORKS_STEPS.map((step, i) => (
                <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }} whileHover={{ y: -4 }} style={{ backgroundColor: 'var(--card-bg-50)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-16px', left: '40px', backgroundColor: '#C9A96E', color: '#0a0a1e', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '9999px' }}>PASO {step.num}</div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A96E', marginBottom: '20px', marginTop: '8px' }}>{step.icon}</div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>{step.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* COMPARATIVA */}
        <section style={{ padding: '96px 24px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} style={{ textAlign: 'center', marginBottom: '48px' }}>
              <motion.span variants={fadeUp} style={{ display: 'inline-block', color: '#C9A96E', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px', marginBottom: '12px' }}>Benchmark</motion.span>
              <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800', letterSpacing: '-0.5px' }}>¿Por qué MockAgent?</motion.h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)' }}>Característica</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '700', color: '#C9A96E' }}>MockAgent</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: 'var(--text-muted)' }}>Beeceptor</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: 'var(--text-muted)' }}>Postman</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_DATA.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: '500' }}>{row.feature}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: row.mockagent.includes('✅') ? '#10b981' : (row.mockagent.includes('❌') ? '#ef4444' : '#C9A96E'), fontWeight: '600' }}>{row.mockagent}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: row.beeceptor.includes('✅') ? '#10b981' : (row.beeceptor.includes('❌') ? '#ef4444' : 'var(--text-muted)'), fontWeight: '500' }}>{row.beeceptor}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: row.postman.includes('✅') ? '#10b981' : (row.postman.includes('❌') ? '#ef4444' : 'var(--text-muted)'), fontWeight: '500' }}>{row.postman}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '16px', fontStyle: 'italic' }}>Datos públicos de precios a junio 2026. Sujetos a cambios por parte de los competidores.</p>
            </motion.div>
          </div>
        </section>

        {/* ABOUT */}
        <section style={{ padding: '96px 24px', maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.span variants={fadeUp} style={{ display: 'block', textAlign: 'center', color: '#C9A96E', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px' }}>Nuestra Misión</motion.span>
            <motion.h2 variants={fadeUp} style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800', marginTop: '12px', letterSpacing: '-0.5px' }}>La infraestructura detrás de MockAgent</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '48px' }}>
            {aboutCards.map((c, i) => (
              <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ backgroundColor: 'var(--card-bg-50)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>{c.icon}</div>
                <h4 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}>{c.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>{c.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} style={{ marginTop: '32px', padding: '24px 28px', borderRadius: '12px', border: '1px dashed rgba(201,169,110,0.2)', backgroundColor: 'rgba(201,169,110,0.03)' }}>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '500' }}>
              <strong>Dato clave:</strong> Los equipos que usan MockAgent reducen hasta un 65% sus costes de API y reducen el Time-to-Market a la mitad.
            </p>
          </motion.div>
        </section>

        {/* TRUST */}
        <section style={{ padding: '64px 24px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
            {trustItems.map((t, i) => (
              <div key={i}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 12px' }}>{t.icon}</div>
                <div style={{ fontWeight: '700', marginBottom: '4px' }}>{t.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={{ padding: '96px 24px', borderTop: '1px solid var(--border-color)', background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.02) 0%, transparent 50%)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} style={{ textAlign: 'center', marginBottom: '48px' }}>
              <motion.span variants={fadeUp} style={{ display: 'inline-block', color: '#C9A96E', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px', marginBottom: '12px' }}>Opiniones</motion.span>
              <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800', letterSpacing: '-0.5px' }}>Lo que dicen los desarrolladores</motion.h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }} whileHover={{ y: -4 }} style={{ backgroundColor: 'var(--card-bg-50)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p style={{ color: 'var(--text-main)', fontSize: '15px', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '24px' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(201,169,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A96E', fontWeight: '700', fontSize: '14px' }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>{t.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '24px', fontStyle: 'italic' }}>Testimonios ilustrativos basados en casos de uso reales de la plataforma.</motion.p>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '96px 24px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} style={{ textAlign: 'center', marginBottom: '48px' }}>
              <motion.span variants={fadeUp} style={{ display: 'inline-block', color: '#C9A96E', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px', marginBottom: '12px' }}>Ayuda</motion.span>
              <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800', letterSpacing: '-0.5px' }}>Preguntas frecuentes</motion.h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger}>
              {FAQ_ITEMS.map((item, i) => (
                <FaqItem key={i} question={item.q} answer={item.a} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* FOOTER PROFESIONAL */}
        <footer style={{ padding: '64px 24px 32px', borderTop: '1px solid var(--border-color)', marginTop: 'auto', backgroundColor: 'var(--card-bg-50)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <img src="/logo.svg" alt="MockAgent" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                <span style={{ fontSize: '16px', fontWeight: '700' }}>MOCK<span style={{ color: '#C9A96E' }}>AGENT</span>.AI</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>Infraestructura de mocking profesional para equipos de desarrollo de IA.</p>
            </div>
            <div>
              <h5 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', color: 'var(--text-muted)' }}>Producto</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><span onClick={() => setVistaActual('signup')} style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: '0.2s' }}>Dashboard</span></li>
                <li><span onClick={() => setVistaActual('pricing')} style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: '0.2s' }}>Pricing</span></li>
                <li><span onClick={() => setModal({ open: true, type: 'info', title: 'Changelog', message: 'Próximamente: exportación OpenAPI, webhooks y workspaces compartidos.', onConfirm: closeModal })} style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: '0.2s' }}>Changelog</span></li>
              </ul>
            </div>
            <div>
              <h5 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', color: 'var(--text-muted)' }}>Recursos</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><span onClick={() => setVistaActual('docs')} style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: '0.2s', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Docs <ExternalLink size={12} /></span></li>
                <li><span title="Repositorio open source próximamente disponible." style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: '0.2s', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>GitHub <ExternalLink size={12} /></span></li>
                <li><span onClick={() => setVistaActual('blog')} style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: '0.2s' }}>Blog</span></li>
              </ul>
            </div>
            <div>
              <h5 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', color: 'var(--text-muted)' }}>Comparar</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {COMPARE_COMPETITORS.map((comp, i) => (
                  <li key={i}><span onClick={() => setVistaActual(`compare-${comp.slug}`)} style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: '0.2s' }}>vs {comp.name}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', color: 'var(--text-muted)' }}>Legal</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><span onClick={() => setVistaActual('privacy')} style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: '0.2s' }}>Privacidad</span></li>
                <li><span onClick={() => setVistaActual('terms')} style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: '0.2s' }}>Términos</span></li>
              </ul>
            </div>
          </div>
          <div style={{ maxWidth: '1280px', margin: '48px auto 0', paddingTop: '24px', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            © 2026 MockAgent AI. Desarrollado para Agentes de Nueva Generación.
          </div>
        </footer>

        {/* POPUP */}
        <AnimatePresence>
          {mostrarPopupLogin && vistaActual === 'landing' && (
            <motion.div key="popup-overlay" variants={overlayAnim} initial="hidden" animate="visible" exit="exit" style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--overlay-bg)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
              <motion.div key="popup-card" variants={modalAnim} initial="hidden" animate="visible" exit="exit" style={{ backgroundColor: 'var(--card-bg)', padding: '44px', borderRadius: '16px', border: '1px solid rgba(201,169,110,0.15)', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: 'var(--gold-glow-strong)' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>Empieza a usar MockAgent</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '14px', lineHeight: '1.5' }}>Crea tu cuenta gratis y desbloquea todas las funciones de simulación de APIs.</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <motion.button onClick={() => { setMostrarPopupLogin(false); setPopupInicialCerrado(true); }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '11px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}>Ahora no</motion.button>
                  <motion.button onClick={() => { setMostrarPopupLogin(false); setVistaActual('signup'); }} whileHover={{ scale: 1.03, backgroundColor: '#D4B87A' }} whileTap={{ scale: 0.97 }} style={{ padding: '11px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#C9A96E', color: '#0a0a1e', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Registrarse gratis</motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ==========================================
  //       DOCS
  // ==========================================
  if (vistaActual === 'docs') {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', fontFamily: 'var(--font-main)', display: 'flex', flexDirection: 'column' }}>
        <nav style={{ ...NAVBAR_STYLE, position: 'sticky' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.svg" alt="MockAgent" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '20px', fontWeight: '700' }}>MOCK<span style={{ color: '#C9A96E' }}>AGENT</span>.AI</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <motion.button onClick={() => setVistaActual('landing')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Volver al inicio</motion.button>
            <ThemeToggle />
          </div>
        </nav>
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '48px 24px', flex: '1 0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={24} color="#C9A96E" /></div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Documentación API</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Referencia completa de la API REST de MockAgent</p>
              </div>
            </div>
            {DOCS_SECTIONS.map((section) => (
              <div key={section.id} style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#C9A96E' }}>{section.title}</h2>
                {section.content && <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>{section.content}</p>}
                {section.endpoints && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {section.endpoints.map((ep, idx) => (
                      <div key={idx} style={{ backgroundColor: 'var(--card-bg-50)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span className={getMethodBadge(ep.method)} style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{ep.method}</span>
                          <code style={{ color: '#C9A96E', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px' }}>{ep.path}</code>
                          {ep.auth && <span style={{ fontSize: '11px', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '4px' }}>JWT requerido</span>}
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>{ep.desc}</p>
                        {ep.body && (
                          <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: '8px', padding: '12px', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', overflowX: 'auto' }}>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '11px' }}>Body:</div>
                            <code style={{ color: '#f59e0b' }}>{ep.body}</code>
                          </div>
                        )}
                        {ep.response && (
                          <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: '8px', padding: '12px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', overflowX: 'auto' }}>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '11px' }}>Response:</div>
                            <code style={{ color: '#10b981' }}>{ep.response}</code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {section.table && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                          {Object.keys(section.table[0]).map(k => <th key={k} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.map((row, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            {Object.values(row).map((val, j) => <td key={j} style={{ padding: '12px 16px', color: j === 0 ? '#C9A96E' : 'var(--text-main)', fontWeight: j === 0 ? '700' : '400' }}>{val}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {section.codes && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {section.codes.map((c, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'baseline', backgroundColor: 'var(--card-bg-50)', borderRadius: '8px', padding: '14px 16px', border: '1px solid var(--border-color)' }}>
                        <code style={{ color: '#ef4444', fontWeight: '700', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', minWidth: '40px' }}>{c.code}</code>
                        <span style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>{c.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
        <footer style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', borderTop: '1px solid var(--border-color)' }}>
          © 2026 MockAgent AI. Desarrollado para Agentes de Nueva Generación.
        </footer>
      </div>
    );
  }

  // ==========================================
  //       BLOG
  // ==========================================
  if (vistaActual === 'blog') {
    const post = selectedBlogId ? BLOG_POSTS.find(b => b.id === selectedBlogId) : null;
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', fontFamily: 'var(--font-main)', display: 'flex', flexDirection: 'column' }}>
        <nav style={{ ...NAVBAR_STYLE, position: 'sticky' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.svg" alt="MockAgent" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '20px', fontWeight: '700' }}>MOCK<span style={{ color: '#C9A96E' }}>AGENT</span>.AI</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <motion.button onClick={() => setVistaActual('landing')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Volver al inicio</motion.button>
            <ThemeToggle />
          </div>
        </nav>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '48px 24px', flex: '1 0 auto' }}>
          {!post ? (
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={24} color="#C9A96E" /></div>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Blog</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Artículos sobre mocking, testing de agentes de IA y arquitectura de APIs</p>
                </div>
              </motion.div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {BLOG_POSTS.map((blog) => (
                  <motion.div key={blog.id} variants={fadeUp} whileHover={{ y: -2 }} onClick={() => setSelectedBlogId(blog.id)} style={{ backgroundColor: 'var(--card-bg-50)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '32px', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      <Calendar size={14} /> {blog.date} · <Clock size={14} /> {blog.readTime}
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>{blog.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>{blog.excerpt}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div onClick={() => setSelectedBlogId(null)} style={{ cursor: 'pointer', marginBottom: '24px', color: '#C9A96E', fontWeight: '500', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={14} /> Volver al blog</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <Calendar size={14} /> {post.date} · <Clock size={14} /> {post.readTime}
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '24px', lineHeight: '1.3' }}>{post.title}</h1>
              <div style={{ color: 'var(--text-main)', fontSize: '15px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {post.content}
              </div>
            </motion.div>
          )}
        </div>
        <footer style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', borderTop: '1px solid var(--border-color)' }}>
          © 2026 MockAgent AI. Desarrollado para Agentes de Nueva Generación.
        </footer>
      </div>
    );
  }

  // ==========================================
  //       PRIVACIDAD
  // ==========================================
  if (vistaActual === 'privacy') {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', fontFamily: 'var(--font-main)', display: 'flex', flexDirection: 'column' }}>
        <nav style={{ ...NAVBAR_STYLE, position: 'sticky' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.svg" alt="MockAgent" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '20px', fontWeight: '700' }}>MOCK<span style={{ color: '#C9A96E' }}>AGENT</span>.AI</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <motion.button onClick={() => setVistaActual('landing')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Volver al inicio</motion.button>
            <ThemeToggle />
          </div>
        </nav>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '48px 24px', flex: '1 0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={24} color="#C9A96E" /></div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Política de Privacidad</h1>
            </div>
            <div style={{ color: 'var(--text-main)', fontSize: '15px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
              {PRIVACY_TEXT}
            </div>
          </motion.div>
        </div>
        <footer style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', borderTop: '1px solid var(--border-color)' }}>
          © 2026 MockAgent AI. Desarrollado para Agentes de Nueva Generación.
        </footer>
      </div>
    );
  }

  // ==========================================
  //       TÉRMINOS
  // ==========================================
  if (vistaActual === 'terms') {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', fontFamily: 'var(--font-main)', display: 'flex', flexDirection: 'column' }}>
        <nav style={{ ...NAVBAR_STYLE, position: 'sticky' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.svg" alt="MockAgent" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '20px', fontWeight: '700' }}>MOCK<span style={{ color: '#C9A96E' }}>AGENT</span>.AI</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <motion.button onClick={() => setVistaActual('landing')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Volver al inicio</motion.button>
            <ThemeToggle />
          </div>
        </nav>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '48px 24px', flex: '1 0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Scale size={24} color="#C9A96E" /></div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Términos de Servicio</h1>
            </div>
            <div style={{ color: 'var(--text-main)', fontSize: '15px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
              {TERMS_TEXT}
            </div>
          </motion.div>
        </div>
        <footer style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', borderTop: '1px solid var(--border-color)' }}>
          © 2026 MockAgent AI. Desarrollado para Agentes de Nueva Generación.
        </footer>
      </div>
    );
  }

  // ==========================================
  //       LOGIN & SIGNUP
  // ==========================================
  if (vistaActual === 'login' || vistaActual === 'signup') {
    const isLogin = vistaActual === 'login';
    const Icon = isLogin ? Mail : UserPlus;
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-main)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(201,169,110,0.06) 0%, transparent 60%)' }} />
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} style={{ backgroundColor: 'rgba(15,15,42,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(201,169,110,0.15)', width: '100%', maxWidth: '448px', boxShadow: 'var(--gold-glow)', position: 'relative', zIndex: 10 }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><Icon size={24} color="#C9A96E" /></div>
          <div onClick={() => setVistaActual('landing')} style={{ cursor: 'pointer', marginBottom: '20px', color: '#C9A96E', fontWeight: '500', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={14} /> Volver al inicio</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>{isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '14px' }}>{isLogin ? 'Introduce tus datos para acceder.' : 'Únete a miles de desarrolladores.'}</p>

          <form onSubmit={isLogin ? manejarLogin : manejarRegistro}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" value={usuario} onChange={(e) => setUsuario(e.target.value)} required style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: '0.2s' }} placeholder="tu@email.com" />
              </div>
            </div>
            <div style={{ marginBottom: isLogin ? '24px' : '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} placeholder="••••••••" />
            </div>
            {!isLogin && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {[
                    { label: 'Mínimo 8 caracteres', check: password.length >= 8 },
                    { label: 'Al menos 1 mayúscula', check: /[A-Z]/.test(password) },
                    { label: 'Al menos 1 minúscula', check: /[a-z]/.test(password) },
                    { label: 'Al menos 1 número', check: /[0-9]/.test(password) },
                    { label: 'Al menos 1 carácter especial (!@#$...)', check: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/.test(password) },
                  ].map((req, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: req.check ? '#10b981' : 'var(--text-muted)', transition: '0.2s' }}>
                      <span style={{ fontSize: '10px' }}>{req.check ? '✓' : '○'}</span>
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isLogin && (
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#C9A96E', cursor: 'pointer' }}
                />
                <label htmlFor="rememberMe" style={{ fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer', userSelect: 'none' }}>Recuérdame</label>
              </div>
            )}
            <motion.button type="submit" disabled={isLogin ? isLoadingLogin : isLoadingSignup} whileHover={{ scale: (isLogin ? isLoadingLogin : isLoadingSignup) ? 1 : 1.02, backgroundColor: '#D4B87A' }} whileTap={{ scale: (isLogin ? isLoadingLogin : isLoadingSignup) ? 1 : 0.98 }} style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: '#C9A96E', color: '#0a0a1e', border: 'none', fontWeight: '700', fontSize: '15px', cursor: (isLogin ? isLoadingLogin : isLoadingSignup) ? 'not-allowed' : 'pointer', boxShadow: 'var(--gold-glow-strong)', opacity: (isLogin ? isLoadingLogin : isLoadingSignup) ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s' }}>
              {(isLogin ? isLoadingLogin : isLoadingSignup) && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
              {isLogin ? 'Entrar' : 'Crear cuenta'}
            </motion.button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: '20px', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>o</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={manejarGoogleLogin}
              onError={() => setMensajeError('Error al iniciar sesión con Google.')}
              theme="outline"
              size="large"
              text={isLogin ? "signin_with" : "signup_with"}
              shape="pill"
              width="320"
            />
          </div>
          <AnimatePresence>
            {mensajeError && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: '#ef4444', marginTop: '16px', textAlign: 'center', fontSize: '13px', backgroundColor: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: '8px' }}>{mensajeError}</motion.p>
            )}
          </AnimatePresence>
          <p onClick={() => setVistaActual(isLogin ? 'signup' : 'login')} style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', cursor: 'pointer', color: 'var(--text-muted)' }}>
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </p>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  //       DASHBOARD
  // ==========================================
  if (vistaActual === 'dashboard') {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', fontFamily: 'var(--font-main)', display: 'flex', flexDirection: 'column' }}>
        {/* DASHBOARD NAV */}
        <nav style={NAVBAR_STYLE}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.svg" alt="MockAgent" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>MOCK<span style={{ color: '#C9A96E' }}>AGENT</span>.AI</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Agente: <span style={{ color: '#C9A96E', fontWeight: '500' }}>{usuario}</span></span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: apiStatus === 'online' ? '#10b981' : '#ef4444', fontWeight: '500' }}>
              <Activity size={12} /> {apiStatus === 'online' ? 'API Online' : 'API Offline'}
            </div>
            <motion.button onClick={() => setVistaActual('perfil')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Perfil</motion.button>
            <motion.button onClick={() => setVistaActual('pricing')} whileHover={{ scale: 1.03, backgroundColor: 'rgba(201,169,110,0.15)' }} whileTap={{ scale: 0.97 }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(201,169,110,0.3)', backgroundColor: 'transparent', color: '#C9A96E', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Actualizar plan</motion.button>
            <button onClick={cerrarSesion} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Cerrar sesión</button>
            <ThemeToggle />
          </div>
        </nav>

        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '24px', flex: '1 0 auto' }}>
          <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.3px' }}>Dashboard de Control</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Sesión: <span style={{ color: '#C9A96E', fontWeight: '500' }}>{usuario}</span> · Plan: <span style={{ color: '#C9A96E', fontWeight: '600', textTransform: 'uppercase' }}>{userPlan || 'starter'}</span> · Endpoints: <span style={{ fontWeight: '600' }}>{endpoints.length}{(userPlan !== 'pro' && userPlan !== 'premium') ? '/' + PLAN_LIMITS.starter : ''}</span></p>
            </div>
            {(userPlan !== 'pro' && userPlan !== 'premium') && (
              <motion.button onClick={() => setVistaActual('pricing')} whileHover={{ scale: 1.03, backgroundColor: 'rgba(201,169,110,0.15)' }} whileTap={{ scale: 0.97 }} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(201,169,110,0.4)', backgroundColor: 'rgba(201,169,110,0.08)', color: '#C9A96E', fontWeight: '600', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={14} /> Actualizar plan
              </motion.button>
            )}
          </motion.header>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} style={{ backgroundColor: 'var(--card-bg-50)', padding: '32px', borderRadius: '16px', border: editingId ? '1px solid rgba(201,169,110,0.4)' : '1px solid rgba(201,169,110,0.15)', marginBottom: '24px', boxShadow: editingId ? '0 0 20px rgba(201,169,110,0.1)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/logo.svg" alt="MockAgent" style={{ width: '16px', height: '16px' }} />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{editingId ? 'Editar Endpoint' : 'Nuevo Endpoint'}</h3>
              </div>
              {editingId && (
                <motion.button type="button" onClick={cancelarEdicion} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: '500', cursor: 'pointer', fontSize: '12px' }}>Cancelar</motion.button>
              )}
            </div>
            <form onSubmit={publicarMock} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input type="text" value={path} onChange={(e) => setPath(e.target.value)} required placeholder="/api/v1/resource" style={{ flex: 2, padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '14px', fontFamily: "'JetBrains Mono', monospace", minWidth: '200px' }} />
                <select value={method} onChange={(e) => setMethod(e.target.value)} style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '14px', fontWeight: '600', minWidth: '100px' }}>
                  <option value="GET">GET</option><option value="POST">POST</option><option value="PUT">PUT</option><option value="DELETE">DELETE</option>
                </select>
                <input type="number" value={status} onChange={(e) => setStatus(e.target.value)} required style={{ width: '80px', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '14px' }} />
                <motion.button type="submit" disabled={isLoadingPublish} whileHover={{ scale: isLoadingPublish ? 1 : 1.03, backgroundColor: '#D4B87A' }} whileTap={{ scale: isLoadingPublish ? 1 : 0.97 }} style={{ padding: '12px 24px', backgroundColor: '#C9A96E', color: '#0a0a1e', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: isLoadingPublish ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: isLoadingPublish ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
                  {isLoadingPublish && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                  {editingId ? 'Guardar cambios' : 'Publicar'}
                </motion.button>
                <AnimatePresence>
                  {showPublishCheck && (
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} style={{ display: 'flex', alignItems: 'center', color: '#10b981' }}>
                      <CheckCircle size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <textarea
                value={responseBody}
                onChange={(e) => setResponseBody(e.target.value)}
                placeholder='{ "message": "Hola desde MockAgent" }'
                rows={5}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  fontFamily: "'JetBrains Mono', monospace",
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </form>
          </motion.div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar endpoint..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }} style={{ backgroundColor: 'var(--card-bg-50)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['ID', 'Endpoint', 'Método', 'Status', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: h === 'Acciones' ? 'center' : 'left', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {endpoints.filter(ep => ep.path.toLowerCase().includes(searchTerm.toLowerCase()) || ep.method.toLowerCase().includes(searchTerm.toLowerCase())).map((ep, idx) => (
                  <motion.tr key={ep.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: idx * 0.04 }} className="endpoint-row" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-muted)' }}>{ep.id}</td>
                    <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono', monospace", color: '#C9A96E', fontSize: '14px', fontWeight: '500' }}>
                      {ep.path}
                      <button onClick={() => { navigator.clipboard.writeText(`https://tfg-mockagent-production.up.railway.app/mock${ep.path}`); showToast('URL copiada al portapapeles'); }} style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: 0.5, transition: '0.2s' }} title="Copiar URL">
                        <Copy size={14} />
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px' }}><span className={getMethodBadge(ep.method)} style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{ep.method}</span></td>
                    <td style={{ padding: '14px 16px', fontWeight: '600', fontSize: '14px' }}>{ep.status}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <motion.button onClick={() => empezarEdicion(ep)} whileHover={{ scale: 1.05, opacity: 1 }} whileTap={{ scale: 0.95 }} style={{ background: 'transparent', border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '12px', color: '#C9A96E', padding: '5px 12px', borderRadius: '6px', opacity: 0.8, transition: '0.2s' }}>
                          Editar
                        </motion.button>
                        <motion.button onClick={() => borrarMock(ep.id)} whileHover={{ scale: 1.05, opacity: 1 }} whileTap={{ scale: 0.95 }} style={{ background: 'transparent', border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)', padding: '5px 12px', borderRadius: '6px', opacity: 0.6, transition: '0.2s' }}>
                          Eliminar
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* LOGS */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 }} style={{ marginTop: '24px', backgroundColor: 'var(--card-bg-50)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo.svg" alt="MockAgent" style={{ width: '16px', height: '16px' }} />
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Logs de Peticiones</h3>
            </div>
            {logs.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>Aún no hay peticiones recibidas. Llama a un endpoint /mock para generar logs.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    {['Fecha', 'Método', 'Path', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, idx) => (
                    <motion.tr key={log.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: idx * 0.04 }} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={{ padding: '12px 16px' }}><span className={getMethodBadge(log.method)} style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{log.method}</span></td>
                      <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", color: '#C9A96E', fontSize: '13px', fontWeight: '500' }}>
                        {log.path}
                        <button onClick={() => { navigator.clipboard.writeText(`https://tfg-mockagent-production.up.railway.app/mock${log.path}`); showToast('URL copiada al portapapeles'); }} style={{ marginLeft: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: 0.5, transition: '0.2s' }} title="Copiar URL">
                          <Copy size={12} />
                        </button>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: '600', fontSize: '13px' }}>{log.statusCode}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ==========================================
  //       PERFIL DE USUARIO
  // ==========================================
  if (vistaActual === 'perfil') {
    const currentEmail = getUserEmail() || usuario || 'usuario@mockagent.ai';
    const avatarLetter = currentEmail ? currentEmail.charAt(0).toUpperCase() : 'A';
    const planName = (userPlan || 'starter').toUpperCase();
    const planColor = planName === 'PRO' ? '#10b981' : planName === 'PREMIUM' ? '#8b5cf6' : '#C9A96E';
    const planLabel = planName === 'STARTER' ? 'Gratis' : planName === 'PRO' ? 'Pro' : 'Premium';
    const endpointCount = endpoints.length;
    const maxEndpoints = planName === 'STARTER' ? 5 : 'Ilimitados';
    const usagePercent = planName === 'STARTER' ? Math.round((endpointCount / 5) * 100) : 0;

    const SectionRow = ({ label, value, action, actionLabel, onClick, danger }) => (
      <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '500', fontSize: '14px', color: 'var(--text-main)', marginBottom: '2px' }}>{label}</div>
          {value && <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{value}</div>}
        </div>
        {action && (
          <motion.button onClick={onClick} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '6px 14px', borderRadius: '6px', border: `1px solid ${danger ? 'rgba(239,68,68,0.3)' : 'var(--border-color)'}`, backgroundColor: 'transparent', color: danger ? '#ef4444' : 'var(--text-main)', fontWeight: '500', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
            {actionLabel}
          </motion.button>
        )}
      </div>
    );

    return (
      <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', fontFamily: 'var(--font-main)', display: 'flex', flexDirection: 'column' }}>
        <nav style={NAVBAR_STYLE}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.svg" alt="MockAgent" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>MOCK<span style={{ color: '#C9A96E' }}>AGENT</span>.AI</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <motion.button onClick={() => setVistaActual('dashboard')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Dashboard</motion.button>
            <motion.button onClick={cerrarSesion} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Salir</motion.button>
            <ThemeToggle />
          </div>
        </nav>

        <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%', padding: '32px 24px', flex: '1 0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Header con X para cerrar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Cuenta</h2>
              <motion.button onClick={() => setVistaActual('dashboard')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} />
              </motion.button>
            </div>

            {/* Sección: Perfil */}
            <div style={{ backgroundColor: 'var(--card-bg-50)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(201,169,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: '#C9A96E' }}>
                  {avatarLetter}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-main)' }}>{fullName || currentEmail}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{userName || currentEmail.split('@')[0]}</div>
                </div>
                <motion.button onClick={() => showToast('Cambio de avatar: proximamente')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}>
                  Cambiar avatar
                </motion.button>
              </div>

              <SectionRow label="Nombre completo" value={fullName || currentEmail.split('@')[0]} action actionLabel="Cambiar nombre" onClick={() => { setModalInput(fullName || currentEmail.split('@')[0]); setModal({ open: true, type: 'edit', title: 'Cambiar nombre completo', message: 'Ingresa tu nuevo nombre completo:', field: 'fullName', onConfirm: (val) => { setFullName(val); saveFullName(val, rememberMe); showToast('Nombre actualizado correctamente'); } }); }} />
              <SectionRow label="Usuario" value={userName || currentEmail.split('@')[0]} action actionLabel="Cambiar usuario" onClick={() => { setModalInput(userName || currentEmail.split('@')[0]); setModal({ open: true, type: 'edit', title: 'Cambiar nombre de usuario', message: 'Ingresa tu nuevo nombre de usuario:', field: 'userName', onConfirm: (val) => { setUserName(val); saveUserName(val, rememberMe); showToast('Usuario actualizado correctamente'); } }); }} />
              <SectionRow label="E-mail" value={currentEmail} action={false} />
            </div>

            {/* Sección: Suscripción */}
            <div style={{ backgroundColor: 'var(--card-bg-50)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', marginTop: 0 }}>Tu suscripción</h3>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Desbloquea la experiencia completa de MockAgent.AI</span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: planColor, color: '#fff', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>{planLabel}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Saca el máximo partido a MockAgent con {planLabel}. <span style={{ color: '#C9A96E', cursor: 'pointer' }}>Más información</span></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.1)', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-main)' }}>Endpoints: {endpointCount} / {maxEndpoints}</div>
                  {planName === 'STARTER' && (
                    <div style={{ marginTop: '6px', height: '6px', borderRadius: '3px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
                      <div style={{ width: `${usagePercent}%`, height: '100%', backgroundColor: usagePercent >= 80 ? '#ef4444' : '#C9A96E', borderRadius: '3px', transition: 'width 0.3s' }} />
                    </div>
                  )}
                </div>
                <motion.button onClick={async () => {
                  try {
                    const r = await API.post('/api/stripe/checkout', { plan: 'pro', email: currentEmail });
                    if (r.data.url) {
                      window.location.href = r.data.url;
                    }
                  } catch (e) {
                    showToast(e.response?.data?.error || 'Error al procesar el pago', 'error');
                  }
                }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontWeight: '500', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  Actualizar plan
                </motion.button>
              </div>
              {(userPlan === 'pro' || userPlan === 'premium') && (
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', fontSize: '13px', fontWeight: '500' }}>
                  ✓ Disfrutas de endpoints ilimitados y soporte prioritario
                </div>
              )}
            </div>

            {/* Sección: Seguridad */}
            <div style={{ backgroundColor: 'var(--card-bg-50)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', marginTop: 0 }}>Seguridad</h3>
              <SectionRow label="Autenticación en dos factores" value="Añade una capa adicional de seguridad a tu cuenta" action actionLabel="Configurar" onClick={() => showToast('2FA: proximamente')} />
              <SectionRow label="Contraseña" value="Última actualización: hace 30 días" action actionLabel="Cambiar" onClick={() => showToast('Cambio de contraseña: proximamente')} />
            </div>

            {/* Sección: Sistema y Tema */}
            <div style={{ backgroundColor: 'var(--card-bg-50)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', marginTop: 0 }}>Sistema</h3>
              <SectionRow label="Tema oscuro" value={isDarkMode ? 'Activado' : 'Desactivado'} action actionLabel={isDarkMode ? 'Desactivar' : 'Activar'} onClick={() => setIsDarkMode(!isDarkMode)} />
              <SectionRow label="Idioma" value="Español" action actionLabel="Cambiar" onClick={() => showToast('Cambio de idioma: proximamente')} />
            </div>

            {/* Sección: Asistencia */}
            <div style={{ backgroundColor: 'var(--card-bg-50)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', marginTop: 0 }}>Asistencia</h3>
              <SectionRow label="Centro de ayuda" value="Documentación y preguntas frecuentes" action actionLabel="Ver docs" onClick={() => setVistaActual('docs')} />
              <SectionRow label="Contacto" value="mockagentai@gmail.com" action actionLabel="Contacto" onClick={() => window.location.href = 'mailto:mockagentai@gmail.com'} />
            </div>

            {/* Sección: Sesión y Cuenta */}
            <div style={{ backgroundColor: 'var(--card-bg-50)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', marginTop: 0 }}>Sesión</h3>
              <SectionRow label="Cerrar sesión" value={`Has iniciado sesión como ${currentEmail}`} action actionLabel="Cerrar sesión" onClick={cerrarSesion} danger />
              <SectionRow label="Cerrar sesión en todas las sesiones" value="Dispositivos o navegadores donde estás conectado" action actionLabel="Cerrar todo" onClick={() => { localStorage.clear(); sessionStorage.clear(); cerrarSesion(); showToast('Sesión cerrada en todos los dispositivos'); }} danger />
              <SectionRow label="Eliminar cuenta" value="Eliminar permanentemente tu cuenta y datos" action actionLabel="Más información" onClick={() => setModal({ open: true, type: 'confirm', title: 'Eliminar cuenta', message: '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer. Todos tus endpoints y logs serán eliminados permanentemente.', onConfirm: () => { showToast('Eliminación de cuenta: contacta a mockagentai@gmail.com'); closeModal(); } })} danger />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ==========================================
  //       PRICING PAGE
  // ==========================================
  if (vistaActual === 'pricing') {
    console.log('RENDERING PRICING PAGE', {PRICING_PLANS, userPlan, isAnnual, selectedCurrency});
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', fontFamily: 'var(--font-main)', display: 'flex', flexDirection: 'column' }}>
        {/* NAVBAR */}
        <nav style={NAVBAR_STYLE}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.svg" alt="MockAgent" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span onClick={() => setVistaActual('landing')} style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px', cursor: 'pointer' }}>MOCK<span style={{ color: '#C9A96E' }}>AGENT</span>.AI</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span onClick={() => setVistaActual('pricing')} style={{ cursor: 'pointer', fontWeight: '500', fontSize: '14px', color: 'var(--text-muted)', transition: '0.2s' }}>Pricing</span>
            {getToken() ? (
              <>
                <motion.button onClick={() => setVistaActual('dashboard')} whileHover={{ scale: 1.04, backgroundColor: '#D4B87A' }} whileTap={{ scale: 0.97 }} style={CTA_PRIMARY}>Dashboard</motion.button>
                <motion.button onClick={cerrarSesion} whileHover={{ scale: 1.04, backgroundColor: 'rgba(239,68,68,0.9)' }} whileTap={{ scale: 0.97 }} style={{ ...CTA_SECONDARY, border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>Cerrar sesión</motion.button>
              </>
            ) : (
              <>
                <span onClick={() => setVistaActual('login')} style={{ cursor: 'pointer', fontWeight: '500', fontSize: '14px', color: 'var(--text-muted)', transition: '0.2s' }}>Login</span>
                <motion.button onClick={() => setVistaActual('signup')} whileHover={{ scale: 1.04, backgroundColor: '#D4B87A' }} whileTap={{ scale: 0.97 }} style={CTA_PRIMARY}>Empezar Gratis</motion.button>
              </>
            )}
            <ThemeToggle />
          </div>
        </nav>

        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '96px 24px', flex: '1 0 auto' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '32px' }}>
            <button
              onClick={() => setVistaActual('landing')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: '0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#C9A96E'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              <ArrowLeft size={16} /> Volver al inicio
            </button>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={stagger} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '12px' }}>Planes diseñados para crecer</motion.h1>
            <motion.p variants={fadeUp} style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>Sin sorpresas. Escala cuando estés listo. Sin tarjeta para empezar.</motion.p>
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '48px', fontSize: '14px', fontWeight: '500' }}>
            <span style={{ color: !isAnnual ? 'var(--text-main)' : 'var(--text-muted)', transition: '0.2s' }}>Mensual</span>
            <button onClick={() => setIsAnnual(!isAnnual)} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: isAnnual ? '#C9A96E' : 'var(--border-color)', border: 'none', cursor: 'pointer', position: 'relative', transition: '0.2s', padding: 0 }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '3px', left: isAnnual ? '23px' : '3px', transition: '0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
            </button>
            <span style={{ color: isAnnual ? 'var(--text-main)' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
              Anual
              <span style={{ backgroundColor: 'rgba(201,169,110,0.15)', color: '#C9A96E', fontSize: '12px', padding: '2px 8px', borderRadius: '9999px', fontWeight: '600' }}>-40%</span>
            </span>
            <span style={{ color: 'var(--border-color)', margin: '0 8px' }}>|</span>
            <div className="currency-dropdown" style={{ position: 'relative' }}>
              <button onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                {(() => { const c = CURRENCIES.find(c => c.code === selectedCurrency); return `${c.code} (${c.symbol})`; })()}
                <span style={{ fontSize: '10px', transition: '0.2s', transform: currencyDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              {currencyDropdownOpen && (
                <div style={{ position: 'absolute', top: '100%', left: '0', marginTop: '8px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', zIndex: 100, minWidth: '180px', padding: '8px 0' }}>
                  {CURRENCIES.map((currency) => (
                    <button key={currency.code} onClick={() => { setSelectedCurrency(currency.code); setCurrencyDropdownOpen(false); }} style={{ width: '100%', padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontSize: '13px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '600', minWidth: '40px' }}>{currency.code}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{currency.name} ({currency.symbol})</span>
                      {selectedCurrency === currency.code && <span style={{ marginLeft: 'auto', color: '#C9A96E' }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {PRICING_PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={plan.highlighted ? 'pro-card-border card-hover' : 'card-hover'}
                style={{
                  backgroundColor: plan.highlighted ? 'rgba(201,169,110,0.03)' : 'var(--card-bg-50)',
                  padding: '32px', borderRadius: '16px',
                  border: plan.highlighted ? '1px solid rgba(201,169,110,0.4)' : '1px solid var(--border-color)',
                  width: '300px', textAlign: 'left',
                  boxShadow: plan.highlighted ? '0 0 40px rgba(201,169,110,0.15), 0 0 80px rgba(201,169,110,0.05)' : 'var(--shadow-sm)',
                  position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                {plan.highlighted && (
                  <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#C9A96E', color: '#0a0a1e', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} /> Recomendado
                  </span>
                )}
                <div>
                  <h3 style={{ fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{plan.name}</h3>
                  <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-1px' }}>
                    <motion.span key={isAnnual ? 'a' : 'm'} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                      {(() => { const p = getPrice(plan); return `${p.symbol}${p.value}`; })()}
                    </motion.span>
                    <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '400' }}>{plan.priceSuffix}</span>
                  </div>
                  {isAnnual && plan.annualBilling && (() => { const b = getAnnualBilling(plan); return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Facturado {b.symbol}{b.value} al año</motion.div>; })()}
                  {!isAnnual && plan.annualBilling && <div style={{ height: '24px' }} />}
                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '20px 0' }} />
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', color: 'var(--text-muted)' }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ marginBottom: '10px', fontSize: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <Check size={16} style={{ color: plan.highlighted ? '#C9A96E' : '#10b981', flexShrink: 0, marginTop: '2px' }} /> <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <motion.button
                  onClick={async () => {
                    const token = getToken();
                    if (!token) {
                      // No logueado: guardar plan pendiente y ir a login
                      setPendingPlan(plan.id);
                      setVistaActual('login');
                      return;
                    }
                    if (plan.id === 'starter') {
                      // Ya tiene plan free, ir al dashboard
                      setVistaActual('dashboard');
                      return;
                    }
                    // Logueado y elige Pro/Premium: iniciar checkout
                    await iniciarCheckout(plan.id);
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: plan.highlighted ? '#D4B87A' : undefined }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '12px',
                    border: plan.highlighted ? 'none' : '1px solid var(--border-color)',
                    backgroundColor: plan.highlighted ? '#C9A96E' : 'transparent',
                    color: plan.highlighted ? '#0a0a1e' : 'var(--text-main)', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
                    boxShadow: plan.highlighted ? 'var(--gold-glow-strong)' : 'none', transition: '0.2s'
                  }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={{ maxWidth: '700px', margin: '64px auto 0' }}>
            <h3 style={{ textAlign: 'center', fontSize: '24px', fontWeight: '700', marginBottom: '32px' }}>Preguntas frecuentes</h3>
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border-color)', padding: '20px 0' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{faq.q}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>{faq.a}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* FOOTER */}
        <footer style={{ padding: '40px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', marginTop: 'auto' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.svg" alt="MockAgent" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
              <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>MOCK<span style={{ color: '#C9A96E' }}>AGENT</span>.AI</span>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <span onClick={() => setVistaActual('landing')} style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: '0.2s' }}>Inicio</span>
              <span onClick={() => setVistaActual('docs')} style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: '0.2s' }}>Docs</span>
              <span onClick={() => setVistaActual('blog')} style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: '0.2s' }}>Blog</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ==========================================
  //       COMPARAR (vs Competidores)
  // ==========================================
  if (vistaActual.startsWith('compare-')) {
    const competitorSlug = vistaActual.replace('compare-', '');
    const competitor = COMPARE_COMPETITORS.find(c => c.slug === competitorSlug);
    if (!competitor) return null;

    return (
      <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', fontFamily: 'var(--font-main)', display: 'flex', flexDirection: 'column' }}>
        <nav style={NAVBAR_STYLE}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.svg" alt="MockAgent" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>MOCK<span style={{ color: '#C9A96E' }}>AGENT</span>.AI</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <motion.button onClick={() => setVistaActual('landing')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Volver al inicio</motion.button>
            <ThemeToggle />
          </div>
        </nav>

        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '48px 24px', flex: '1 0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ marginBottom: '48px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '12px' }}>
                Best Alternative to {competitor.name}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.7' }}>
                {competitor.description}
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg-50)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', marginBottom: '48px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'rgba(201,169,110,0.05)' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: 'var(--text-muted)', fontSize: '13px' }}>Feature</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '700', color: '#C9A96E', fontSize: '13px' }}>MockAgent</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '700', color: 'var(--text-muted)', fontSize: '13px' }}>{competitor.name}</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '700', fontSize: '13px' }}>Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {competitor.data.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }} className="endpoint-row">
                      <td style={{ padding: '14px 16px', fontWeight: '500', fontSize: '14px' }}>{row.feature}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '14px', color: row.winner === 'mockagent' ? '#10b981' : 'var(--text-main)', fontWeight: row.winner === 'mockagent' ? '600' : '400' }}>
                        {row.mockagent}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '14px', color: row.winner === 'competitor' ? '#10b981' : 'var(--text-main)', fontWeight: row.winner === 'competitor' ? '600' : '400' }}>
                        {row.competitor}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '14px' }}>
                        {row.winner === 'mockagent' && <span style={{ color: '#10b981', fontWeight: '600' }}>✅ MockAgent</span>}
                        {row.winner === 'competitor' && <span style={{ color: 'var(--text-muted)' }}>{competitor.name}</span>}
                        {row.winner === 'empate' && <span style={{ color: '#C9A96E' }}>Empate</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>¿Listo para probar MockAgent?</h3>
              <motion.button onClick={() => setVistaActual('signup')} whileHover={{ scale: 1.04, backgroundColor: '#D4B87A' }} whileTap={{ scale: 0.97 }} style={{ ...CTA_PRIMARY, padding: '14px 28px', fontSize: '16px', borderRadius: '12px' }}>
                Empezar Gratis
              </motion.button>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-muted)' }}>Comparar con otros</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {COMPARE_COMPETITORS.filter(c => c.slug !== competitorSlug).map((c, i) => (
                  <motion.button key={i} onClick={() => setVistaActual(`compare-${c.slug}`)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                    vs {c.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <footer style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', borderTop: '1px solid var(--border-color)' }}>
          © 2026 MockAgent AI. Desarrollado para Agentes de Nueva Generación.
        </footer>
      </div>
    );
  }
  }

  /* ===================== MODAL GLOBAL ===================== */
  return (
    <>
      {renderVista()}
      <AnimatePresence>
        {modal.open && (
          <motion.div
            key="modal-overlay"
            variants={overlayAnim}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="modal-overlay"
            style={{ zIndex: 9999 }}
            onClick={closeModal}
          >
            <motion.div
              key="modal-card"
              variants={modalAnim}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="modal-card"
              style={{ textAlign: 'center' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                {modal.type === 'delete' ? (
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={24} color="#ef4444" />
                  </div>
                ) : (
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={24} color="#C9A96E" />
                  </div>
                )}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>{modal.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>{modal.message}</p>
              {modal.type === 'edit' && (
                <div style={{ marginBottom: '24px' }}>
                  <input
                    type="text"
                    value={modalInput}
                    onChange={(e) => setModalInput(e.target.value)}
                    placeholder="Escribe aquí..."
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--text-main)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                {(modal.type === 'delete' || modal.type === 'edit') && (
                  <motion.button
                    onClick={closeModal}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'transparent',
                      color: 'var(--text-muted)',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: '0.2s'
                    }}
                  >
                    Cancelar
                  </motion.button>
                )}
                <motion.button
                  onClick={() => {
                    if (modal.type === 'edit' && modal.onConfirm) {
                      modal.onConfirm(modalInput);
                      setModalInput('');
                    } else if (modal.onConfirm) {
                      modal.onConfirm();
                    }
                    closeModal();
                  }}
                  whileHover={{ scale: 1.03, opacity: 0.9 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: modal.type === 'delete' ? '#ef4444' : '#C9A96E',
                    color: modal.type === 'delete' ? '#fff' : '#0a0a1e',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: '0.2s',
                    boxShadow: modal.type === 'delete' ? '0 0 20px rgba(239,68,68,0.3)' : 'var(--gold-glow-strong)'
                  }}
                >
                  {modal.type === 'delete' ? 'Eliminar' : modal.type === 'edit' ? 'Guardar' : 'Aceptar'}
                </motion.button>
              </div>
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Progress Bar - Solo en Landing */}
      {vistaActual === 'landing' && (
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      )}

      {/* Back to Top Button - Solo en Landing */}
      {vistaActual === 'landing' && (
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="back-to-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              title="Volver arriba"
            >
              <span style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 'bold' }}>↑</span>
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="toast-container"
          >
            <div className={`toast ${toast.type}`}>
              <span style={{ color: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#C9A96E', display: 'flex', alignItems: 'center' }}>
                {toast.type === 'success' ? <CheckCircle size={20} /> : toast.type === 'error' ? <AlertTriangle size={20} /> : <Zap size={20} />}
              </span>
              <span style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: '500' }}>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Widget */}
      <ChatWidget />
    </>
  );
}

export default App;