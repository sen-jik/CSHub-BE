module.exports = {
  apps: [
    {
      name: 'cshub',
      script: './dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '200M',
    },
  ],
};
