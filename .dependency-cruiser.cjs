/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-domain-imports-from-infrastructure',
      comment:
        'Domain must not import from infrastructure. Domain is the innermost layer and must remain framework-free.',
      severity: 'error',
      from: { path: '^src/domain/' },
      to: { path: '^src/infrastructure/' },
    },
    {
      name: 'no-domain-imports-from-application',
      comment:
        'Domain must not import from application. Domain must not depend on its own use cases.',
      severity: 'error',
      from: { path: '^src/domain/' },
      to: { path: '^src/application/' },
    },
    {
      name: 'no-application-imports-from-infrastructure-http',
      comment:
        'Application use cases must not import from the HTTP infrastructure layer. HTTP is a delivery mechanism; use cases must remain transport-agnostic.',
      severity: 'error',
      from: { path: '^src/application/' },
      to: { path: '^src/infrastructure/http/' },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    reporterOptions: {
      text: {
        highlightFocused: true,
      },
    },
  },
};
