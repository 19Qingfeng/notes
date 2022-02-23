const path = require('path');
const fs = require('fs');

// 创建三个字节大小的BUFFER内存空间
const buf = Buffer.alloc(3);

function copy(sourcePath, targetPath) {
  // 读偏移量
  let readPosition = 0;
  // 写偏移量
  let writePosition = 0;
  // 打开源文件/ 读操作
  fs.open(sourcePath, 'r', (error, rfd) => {
    // 打开源文件/ 写操作权限
    fs.open(targetPath, 'w', (error, wfd) => {
      function next() {
        // 异步迭代抽象成为迭代函数
        fs.read(rfd, buf, 0, 3, readPosition, (error, bytesRead) => {
          // 小于3 就可以不用继续递归了
          if (bytesRead < 3) return;
          readPosition += bytesRead;
          fs.write(wfd, buf, 0, 3, writePosition, (error, written) => {
            writePosition += written;
            next();
          });
        });
      }
      next();
    });
  });
}

copy(
  path.resolve(__dirname, './text1.txt'),
  path.resolve(__dirname, './text2.txt')
);
