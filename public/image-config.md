# 🖼️ Configuración de Imágenes para Gamizky PWA

## Imágenes Requeridas

### 📱 gamizkyIcon.png (Principal)
- **Uso**: Favicon, iconos PWA, notificaciones
- **Tamaño recomendado**: 512x512px (mínimo 192x192px)
- **Formato**: PNG con transparencia
- **Ubicación**: `/public/gamizkyIcon.png`

### 🖼️ gamizky.png (Apaisada)
- **Uso**: Screenshots del manifest, previews
- **Tamaño recomendado**: 1280x720px (16:9)
- **Formato**: PNG
- **Ubicación**: `/public/gamizky.png`

## Escalado Automático

El sistema PWA escalará automáticamente `gamizkyIcon.png` a los siguientes tamaños:
- 72x72px
- 96x96px
- 128x128px
- 144x144px
- 152x152px
- 192x192px
- 384x384px
- 512x512px

## Optimización

### Para gamizkyIcon.png:
- Usa PNG con transparencia
- Mantén el diseño simple y reconocible
- Evita texto pequeño que se pierda en tamaños pequeños
- Usa colores contrastantes

### Para gamizky.png:
- Captura la funcionalidad principal de la app
- Mantén una buena resolución
- Usa el formato 16:9 para compatibilidad
- Incluye elementos visuales atractivos

## Verificación

Para verificar que las imágenes funcionan correctamente:

1. **Chrome DevTools** → Application → Manifest
2. **Lighthouse** → PWA Score
3. **Instalación** → Verificar icono en la app instalada

## Personalización

Si quieres cambiar las imágenes:
1. Reemplaza los archivos en `/public/`
2. Mantén los mismos nombres o actualiza las referencias
3. Verifica que los nuevos tamaños sean apropiados
4. Prueba la instalación PWA

---

**Nota**: Las imágenes se cachean automáticamente por el Service Worker para funcionamiento offline.
