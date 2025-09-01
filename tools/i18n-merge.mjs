#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import { glob } from 'glob';

// 命令行参数解析
const args = process.argv.slice(2);

const options = {
  scan: false,
  check: false,
  write: false,
  pretty: false,
  file: null,
  template: null,
  scanDir: null
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  switch (arg) {
    case '--scan':
      options.scan = true;

      if (args[i + 1] && !args[i + 1].startsWith('--')) {
        options.scanDir = args[i + 1];
        i++;
      }

      break;

    case '--check':
      options.check = true;

      break;

    case '--write':
      options.write = true;

      break;

    case '--pretty':
      options.pretty = true;

      break;

    case '--file':
      if (args[i + 1]) {
        options.file = args[i + 1];
        i++;
      }

      break;

    case '--template':
      if (args[i + 1]) {
        options.template = args[i + 1];
        i++;
      }

      break;
  }
}

// 扫描代码中的翻译键
function scanTranslationKeys(directory) {
  console.log(`🔍 扫描目录: ${directory}`);
  
  const patterns = [
    `${directory}/**/*.{ts,tsx,js,jsx}`,
    `!${directory}/**/node_modules/**`,
    `!${directory}/**/*.d.ts`
  ];
  
  const files = glob.sync(patterns);
  const translationKeys = new Set();
  
  // 匹配 useTranslations('namespace') 和 t('key.path')
  const useTranslationsRegex = /useTranslations\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  const tFunctionRegex = /\bt\s*\(\s*['"`]([^'"`]+)['"`]/g;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // 提取 useTranslations 的命名空间
    let match;
    const namespaces = new Set();
    
    while ((match = useTranslationsRegex.exec(content)) !== null) {
      namespaces.add(match[1]);
    }
    
    // 提取 t() 函数的键
    while ((match = tFunctionRegex.exec(content)) !== null) {
      const key = match[1];
      
      // 如果有命名空间，为每个命名空间添加键
      if (namespaces.size > 0) {
        namespaces.forEach(namespace => {
          translationKeys.add(`${namespace}.${key}`);
        });
      } else {
        // 如果没有明确的命名空间，直接添加键
        translationKeys.add(key);
      }
    }
  });
  
  console.log(`✅ 扫描完成，找到 ${translationKeys.size} 个翻译键`);

  return Array.from(translationKeys).sort();
}

// 深度合并对象
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

// 检查缺失的翻译键
function checkMissingKeys(currentFile, templateFile) {
  console.log(`🔍 检查缺失的翻译键...`);
  
  let current = {};
  let template = {};

  try {
    if (fs.existsSync(currentFile)) {
      current = JSON.parse(fs.readFileSync(currentFile, 'utf8'));
    }
    
    if (fs.existsSync(templateFile)) {
      template = JSON.parse(fs.readFileSync(templateFile, 'utf8'));
    }
  } catch (error) {
    console.error(`❌ 读取文件失败: ${error.message}`);
    process.exit(1);
  }
  
  const missingKeys = [];

  function checkKeys(templateObj, currentObj, prefix = '') {
    for (const key in templateObj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof templateObj[key] === 'object' && templateObj[key] !== null) {
        if (!currentObj[key] || typeof currentObj[key] !== 'object') {
          missingKeys.push(fullKey);
        } else {
          checkKeys(templateObj[key], currentObj[key], fullKey);
        }
      } else {
        if (!(key in currentObj)) {
          missingKeys.push(fullKey);
        }
      }
    }
  }
  
  checkKeys(template, current);

  if (missingKeys.length > 0) {
    console.log(`❌ 发现 ${missingKeys.length} 个缺失的翻译键:`);
    missingKeys.forEach(key => console.log(`   - ${key}`));
  } else {
    console.log(`✅ 所有翻译键都已存在`);
  }
  
  return missingKeys;
}

// 写入合并后的翻译文件
function writeMergedTranslations(currentFile, templateFile, pretty = false) {
  console.log(`📝 合并翻译文件...`);
  
  let current = {};
  let template = {};
  
  try {
    if (fs.existsSync(currentFile)) {
      current = JSON.parse(fs.readFileSync(currentFile, 'utf8'));
    }
    
    if (fs.existsSync(templateFile)) {
      template = JSON.parse(fs.readFileSync(templateFile, 'utf8'));
    }
  } catch (error) {
    console.error(`❌ 读取文件失败: ${error.message}`);
    process.exit(1);
  }
  
  // 合并模板到当前文件
  const merged = deepMerge(current, template);
  
  // 确保目录存在
  const dir = path.dirname(currentFile);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // 写入文件
  const jsonString = pretty 
    ? JSON.stringify(merged, null, 2)
    : JSON.stringify(merged);
  
  fs.writeFileSync(currentFile, jsonString, 'utf8');
  
  console.log(`✅ 翻译文件已更新: ${currentFile}`);
}

// 主函数
function main() {
  if (options.scan) {
    if (!options.scanDir) {
      console.error('❌ --scan 需要指定扫描目录');
      process.exit(1);
    }
    
    const keys = scanTranslationKeys(options.scanDir);

    console.log('\n📋 发现的翻译键:');
    keys.forEach(key => console.log(`   - ${key}`));

    return;
  }
  
  if (options.check) {
    if (!options.file || !options.template) {
      console.error('❌ --check 需要指定 --file 和 --template 参数');
      process.exit(1);
    }
    
    const missingKeys = checkMissingKeys(options.file, options.template);

    process.exit(missingKeys.length > 0 ? 1 : 0);
  }
  
  if (options.write) {
    if (!options.file || !options.template) {
      console.error('❌ --write 需要指定 --file 和 --template 参数');
      process.exit(1);
    }
    
    writeMergedTranslations(options.file, options.template, options.pretty);

    return;
  }
  
  // 显示帮助信息
  console.log(`
🌐 i18n 合并工具

用法:
  node i18n-merge.mjs --scan <目录>                           # 扫描翻译键
  node i18n-merge.mjs --check --file <文件> --template <模板>   # 检查缺失键
  node i18n-merge.mjs --write --file <文件> --template <模板>   # 合并翻译

选项:
  --scan <目录>      扫描指定目录中的翻译键
  --check           检查缺失的翻译键
  --write           写入合并后的翻译文件
  --pretty          格式化输出的 JSON
  --file <文件>      目标翻译文件路径
  --template <模板>  模板翻译文件路径
`);
}

main();