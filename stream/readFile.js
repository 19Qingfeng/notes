const path = require('path');
const fs = require('fs');

// 创建三个字节大小的BUFFER内存空间
const buf = Buffer.alloc(3);

function copy(sourcePath, targetPath, callback) {
  // 读偏移量
  let readPosition = 0;
  // 写偏移量
  let writePosition = 0;
  // 读取完毕逻辑
  function destroy(rfd, wrd) {
    let count = 0;
    function done() {
      if (++count === 2) {
        // 两个都完毕了
        callback();
      }
    }
    fs.close(rfd, done);
    fs.close(wrd, done);
  }
  // 打开源文件/ 读操作
  fs.open(sourcePath, 'r', (error, rfd) => {
    // 打开源文件/ 写操作权限
    fs.open(targetPath, 'w', (error, wfd) => {
      function next() {
        console.log('一次一次');
        // 异步迭代抽象成为迭代函数
        fs.read(rfd, buf, 0, 3, readPosition, (error, bytesRead) => {
          // 小于3 就可以不用继续递归了
          readPosition += bytesRead;
          fs.write(wfd, buf, 0, bytesRead, writePosition, (error, written) => {
            if (bytesRead < 3) return destroy(rfd, wfd);
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
  path.resolve(__dirname, './text2.txt'),
  () => {
    console.log('copy完成');
  }
);
