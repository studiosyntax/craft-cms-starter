/**
 * Module Auto-Discovery
 *
 * Uses Vite's import.meta.glob to automatically discover and register every
 * *.js file in src/js/modules/ (one directory level only — base classes in _/
 * and archived modules in _archive/ are excluded automatically).
 *
 * Convention: the file name IS the module name.
 *   modules/fade.js    → data-module="fade"
 *   modules/parallax.js → data-module="parallax"
 *
 * Adding a new module is a one-step process: create the file. No registration
 * code needed.
 */

// Eager: all modules are bundled and available synchronously.
// Only direct children of modules/ are matched (no subdirectories).
const moduleFiles = import.meta.glob("../*.js", { eager: true });

export const modules = {};

for (const [path, mod] of Object.entries(moduleFiles)) {
  const name = path.split("/").pop().replace(".js", "");

  // Find the first exported class/constructor in the file.
  // By convention each module file exports exactly one class.
  const ModuleClass = Object.values(mod).find(
    (v) => typeof v === "function" && v.prototype
  );

  if (ModuleClass) {
    modules[name] = ModuleClass;
  }
}

/**
 * Instantiates all [data-module] elements found in the document.
 * Returns the array of live module instances.
 *
 * @returns {BaseModule[]}
 */
export function createModules() {
  return Array.from(document.querySelectorAll("[data-module]"))
    .map((element) => {
      const name = element.dataset.module;
      const ModuleClass = modules[name];

      if (!ModuleClass) {
        console.warn(
          `[Dom] Module not found: "${name}". ` +
            `Make sure a file named ${name}.js exists in src/js/modules/.`
        );
        return null;
      }

      try {
        return new ModuleClass(element);
      } catch (err) {
        console.warn(`[Dom] Failed to instantiate module "${name}":`, err);
        return null;
      }
    })
    .filter(Boolean);
}
