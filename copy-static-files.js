const fs = require('fs');
const path = require('path');

function copyStaticFiles() {
  console.log('📁 Copiando arquivos estáticos...');

  const publicDir = path.join(__dirname, 'client/public');
  const nextStaticDir = path.join(__dirname, 'client/.next/static');

  // Criar pasta se não existir
  if (!fs.existsSync(nextStaticDir)) {
    fs.mkdirSync(nextStaticDir, { recursive: true });
  }

  // Arquivos para copiar
  const filesToCopy = [
    'sw.js',
    'manifest.json',
    'favicon.ico'
  ];

  filesToCopy.forEach(file => {
    const sourcePath = path.join(publicDir, file);
    const destPath = path.join(nextStaticDir, file);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copiado: ${file}`);
    } else {
      console.log(`❌ Arquivo não encontrado: ${file}`);
    }
  });

  // Copiar pasta icons
  const iconsSourceDir = path.join(publicDir, 'icons');
  const iconsDestDir = path.join(nextStaticDir, 'icons');

  if (fs.existsSync(iconsSourceDir)) {
    if (!fs.existsSync(iconsDestDir)) {
      fs.mkdirSync(iconsDestDir, { recursive: true });
    }

    const iconFiles = fs.readdirSync(iconsSourceDir);
    iconFiles.forEach(file => {
      const sourcePath = path.join(iconsSourceDir, file);
      const destPath = path.join(iconsDestDir, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copiado ícone: ${file}`);
    });
  }

  // Copiar pasta screenshots (se existir)
  const screenshotsSourceDir = path.join(publicDir, 'screenshots');
  const screenshotsDestDir = path.join(nextStaticDir, 'screenshots');

  if (fs.existsSync(screenshotsSourceDir)) {
    if (!fs.existsSync(screenshotsDestDir)) {
      fs.mkdirSync(screenshotsDestDir, { recursive: true });
    }

    const screenshotFiles = fs.readdirSync(screenshotsSourceDir);
    screenshotFiles.forEach(file => {
      const sourcePath = path.join(screenshotsSourceDir, file);
      const destPath = path.join(screenshotsDestDir, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copiado screenshot: ${file}`);
    });
  }

  console.log('🎉 Arquivos estáticos copiados com sucesso!');
  console.log('📁 Pasta de destino:', nextStaticDir);
}

// Executar se o arquivo for executado diretamente
if (require.main === module) {
  copyStaticFiles();
}

module.exports = copyStaticFiles; 