## 2026-05-12 - [Lazy Loading Route Components]
**Learning:** Large monolithic bundles increase initial load time and TTI, especially in mobile-first applications with many heavy components (like those with large constant data sets). React.lazy/Suspense is an effective way to split these.
**Action:** Always consider route-based splitting using React.lazy for applications with distinct views to improve perceived performance.
