# Diagrama de Arquitectura y Flujo - App San Valentín

## 🏗️ Arquitectura de la Aplicación

```
┌─────────────────────────────────────────────────────────────┐
│                     APLICACIÓN WEB                          │
│                  San Valentín Interactivo                   │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼───────┐       ┌──────▼──────┐
        │  FRONTEND     │       │   ASSETS    │
        │  (Cliente)    │       │ (Recursos)  │
        └───────┬───────┘       └──────┬──────┘
                │                      │
    ┌───────────┼──────────┐          │
    │           │          │          │
┌───▼───┐  ┌───▼───┐  ┌──▼───┐  ┌───▼────┐
│ HTML5 │  │ CSS3  │  │  JS  │  │ Images │
│ 1.7KB │  │ 4.7KB │  │ 2.6KB│  │ Video  │
└───┬───┘  └───┬───┘  └──┬───┘  └───┬────┘
    │          │          │          │
    └──────────┴──────────┴──────────┘
                │
        ┌───────▼────────┐
        │  Navegador     │
        │  (Renderer)    │
        └────────────────┘
```

---

## 📱 Flujo de Usuario Detallado

```
┌──────────────────────────────────────────────────────────────┐
│ PASO 1: CARGA INICIAL                                        │
├──────────────────────────────────────────────────────────────┤
│ Usuario abre → index.html                                    │
│              ↓                                                │
│ Se cargan:   • HTML (estructura)                            │
│              • CSS (estilos + animaciones)                   │
│              • JS (lógica)                                   │
│              • Fondo.jpg (imagen)                            │
│              • Google Fonts (tipografía)                     │
│              ↓                                                │
│ Resultado:   Pantalla de inicio visible                     │
│              Botón "💘 ¡Ver sorpresa!" activo               │
└──────────────────────────────────────────────────────────────┘
                        │
                        │ Click en botón
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ PASO 2: INICIO DE EXPERIENCIA                               │
├──────────────────────────────────────────────────────────────┤
│ Event: startBtn.addEventListener("click")                    │
│        ↓                                                      │
│ Acciones simultáneas:                                        │
│   1. showHearts() → Crea 12 corazones                       │
│   2. rhinaVideo.classList.add("show")                       │
│   3. startBtn.style.display = "none"                        │
│   4. rhinaVideo.play()                                      │
└──────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ PASO 3: ANIMACIONES ACTIVAS                                 │
├──────────────────────────────────────────────────────────────┤
│ Corazones flotantes:                                         │
│   • 12 corazones creados con intervalo de 120ms             │
│   • Posición horizontal aleatoria (10%-90%)                 │
│   • Animación floatHeart (2 segundos)                       │
│   • Movimiento ascendente con fade out                      │
│   • Auto-eliminación tras 2 segundos                        │
│                                                              │
│ Fondo animado:                                               │
│   • Efecto pulseBg continuo                                 │
│   • Ciclo: scale(1) → scale(1.02) → scale(1)               │
│   • Duración: 2 segundos infinitos                          │
└──────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ PASO 4: REPRODUCCIÓN DE VIDEO                               │
├──────────────────────────────────────────────────────────────┤
│ Video desde Cloudinary:                                      │
│   • URL: res.cloudinary.com/.../1.Rhinaf_b2lewf.mp4        │
│   • Formato: MP4 (H.264)                                    │
│   • Controles: Básicos HTML5                                │
│   • Posición: Específica por plataforma                     │
│                                                              │
│ Detección de plataforma:                                     │
│   • iOS → clase "ios-video"                                 │
│   • Android → clase "android-video"                         │
│   • Web → clase "web-video"                                 │
│                                                              │
│ Estado: Video en reproducción...                            │
└──────────────────────────────────────────────────────────────┘
                        │
                        │ rhinaVideo.onended
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ PASO 5: MENSAJE FINAL                                       │
├──────────────────────────────────────────────────────────────┤
│ Transición de pantallas:                                     │
│   • startScreen.classList.remove("active")                  │
│   • quizScreen.classList.add("active")                      │
│                                                              │
│ Mensaje mostrado:                                            │
│   ┌────────────────────────────────────┐                   │
│   │         Rhi                         │                   │
│   │  ¿Te gustaría ser mi               │                   │
│   │  San Valentín? 💘                  │                   │
│   └────────────────────────────────────┘                   │
│                                                              │
│ Tipografía: Great Vibes (cursiva romántica)                 │
│ Posición: Ajustada según plataforma                         │
│                                                              │
│ Estado: EXPERIENCIA COMPLETADA ✓                           │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 Componentes CSS

```
┌─────────────────────────────────────────┐
│         JERARQUÍA DE ESTILOS            │
├─────────────────────────────────────────┤
│                                         │
│  body                                   │
│   └─ .app (contenedor principal)       │
│       ├─ ::before (fondo animado)      │
│       ├─ .screen (pantallas)           │
│       │   ├─ #start-screen             │
│       │   │   └─ .content              │
│       │   │       ├─ .rhina-video      │
│       │   │       └─ .btn-start        │
│       │   │                             │
│       │   └─ #quiz-screen              │
│       │       └─ .quiz-message         │
│       │                                 │
│       └─ #hearts-container (overlay)   │
│           └─ .heart (×12 dinámicos)    │
│                                         │
└─────────────────────────────────────────┘
```

### Animaciones CSS Implementadas

```
┌────────────────────────────────────────────────┐
│ @keyframes floatHeart                          │
├────────────────────────────────────────────────┤
│ Duración: 2s                                   │
│ Timing: linear                                 │
│ Fill-mode: forwards                            │
│                                                │
│ 0%   → scale(1.0)   translateY(0)    opacity 1 │
│ 80%  → scale(1.15)  translateY(-144px) opacity 0.8│
│ 100% → scale(1.3)   translateY(-180px) opacity 0│
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ @keyframes pulseBg                             │
├────────────────────────────────────────────────┤
│ Duración: 2s                                   │
│ Timing: ease-in-out                            │
│ Iteration: infinite                            │
│                                                │
│ 0%   → scale(1.0)   brightness(1.0)           │
│ 40%  → scale(1.02)  brightness(1.06)          │
│ 70%  → scale(1.01)  brightness(1.02)          │
│ 100% → scale(1.0)   brightness(1.0)           │
└────────────────────────────────────────────────┘
```

---

## 🔄 Diagrama de Estados

```
┌─────────────┐
│   INICIAL   │ (Página cargada)
└──────┬──────┘
       │ click startBtn
       ▼
┌─────────────┐
│  ANIMANDO   │ (Corazones + Video cargando)
└──────┬──────┘
       │ video.play()
       ▼
┌─────────────┐
│ REPRODUCIENDO│ (Video activo)
└──────┬──────┘
       │ video.onended
       ▼
┌─────────────┐
│   MENSAJE   │ (Pantalla final)
└─────────────┘
```

---

## 📊 Diagrama de Dependencias

```
┌────────────────────────────────────────────┐
│         DEPENDENCIAS EXTERNAS              │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────┐    ┌─────────────────┐ │
│  │ Google Fonts │    │   Cloudinary    │ │
│  │ (Great Vibes)│    │   (Video MP4)   │ │
│  └──────┬───────┘    └────────┬────────┘ │
│         │                     │           │
│         └──────────┬──────────┘           │
│                    ▼                       │
│         ┌──────────────────┐              │
│         │   index.html     │              │
│         └──────────────────┘              │
│                                            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│         DEPENDENCIAS INTERNAS              │
├────────────────────────────────────────────┤
│                                            │
│         index.html                         │
│             │                              │
│     ┌───────┼───────┐                     │
│     ▼       ▼       ▼                     │
│  style.css script.js fondo.jpg            │
│                                            │
│  No hay dependencias circulares            │
│  Arquitectura lineal y simple              │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🎯 Puntos de Interacción

```
┌─────────────────────────────────────────────────┐
│            EVENTOS DEL USUARIO                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Click en botón                              │
│     ↓                                           │
│     startBtn.addEventListener("click", ...)     │
│     ↓                                           │
│     • showHearts()                              │
│     • Ocultar botón                             │
│     • Mostrar video                             │
│     • Reproducir video                          │
│                                                 │
│  2. Fin de video (automático)                   │
│     ↓                                           │
│     rhinaVideo.onended = () => {...}            │
│     ↓                                           │
│     • Ocultar pantalla inicio                   │
│     • Mostrar pantalla mensaje                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Adaptación Multiplataforma

```
┌────────────────────────────────────────────────────┐
│        DETECCIÓN DE PLATAFORMA                     │
├────────────────────────────────────────────────────┤
│                                                    │
│  setVideoPlatformClass()                          │
│         │                                          │
│         ├─ /android/i.test(userAgent)             │
│         │       ↓                                  │
│         │  .android-video + .android-message      │
│         │   • Video: relative, top: 100px         │
│         │   • Mensaje: bottom: 60px               │
│         │                                          │
│         ├─ /iPad|iPhone|iPod/.test(userAgent)     │
│         │       ↓                                  │
│         │  .ios-video + .ios-message              │
│         │   • Video: fixed, bottom: 40px          │
│         │   • Mensaje: bottom: 60px               │
│         │                                          │
│         └─ else (Web/Desktop)                     │
│                ↓                                   │
│           .web-video + .web-message               │
│           • Video: margin-top: 160px              │
│           • Mensaje: bottom: 100px                │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 📐 Sistema de Layout Responsivo

```
┌──────────────────────────────────────────────┐
│         BREAKPOINTS Y ADAPTACIÓN             │
├──────────────────────────────────────────────┤
│                                              │
│  Desktop (> 600px)                           │
│  ┌────────────────────────┐                 │
│  │                        │                 │
│  │  .app                  │                 │
│  │  width: min(420px, 90vw)│                 │
│  │  aspect-ratio: 9/16    │                 │
│  │  max-height: 100dvh    │                 │
│  │                        │                 │
│  └────────────────────────┘                 │
│                                              │
│  Móvil (≤ 600px)                            │
│  ┌──────────┐                               │
│  │          │                               │
│  │  .app    │                               │
│  │  width: 90vw│                               │
│  │  min-height:│                               │
│  │  100dvh  │                               │
│  │          │                               │
│  └──────────┘                               │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 🎭 Paleta de Colores

```
┌────────────────────────────────┐
│      COLORES PRINCIPALES       │
├────────────────────────────────┤
│                                │
│  #e91e63  ■  Rosa principal    │
│           ↓  (botones, texto)  │
│                                │
│  #ffffff  □  Blanco            │
│           ↓  (fondo, bordes)   │
│                                │
│  #f0f0f0  ▢  Gris claro        │
│           ↓  (fondo body)      │
│                                │
│  rgba(0,0,0,0.3)  ▓            │
│           ↓  Sombras           │
│                                │
└────────────────────────────────┘
```

---

## 📊 Métricas de Performance

```
┌─────────────────────────────────────────┐
│       TIEMPO DE CARGA ESTIMADO          │
├─────────────────────────────────────────┤
│                                         │
│  HTML      │█░░░░░░░░░│ < 0.1s         │
│  CSS       │██░░░░░░░░│ < 0.1s         │
│  JS        │█░░░░░░░░░│ < 0.1s         │
│  Font      │████░░░░░░│ 0.3-0.5s       │
│  Fondo.jpg │████░░░░░░│ 0.3-0.8s       │
│  Video     │████████░░│ 2-5s           │
│            │           │ (depende de   │
│            │           │  conexión)    │
│                                         │
│  TOTAL: 0.5-6 segundos                 │
│  (sin contar video completo)           │
│                                         │
└─────────────────────────────────────────┘
```

---

**Diagrama creado por:** GitHub Copilot Coding Agent  
**Fecha:** 7 de Febrero de 2026  
**Versión:** 1.0
