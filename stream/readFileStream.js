const fs = require('fs');
const path = require('path');

// rs 可读流对象
const rs = fs.createReadStream(path.resolve(__dirname, './text1.txt'), {
  flags: 'r', // 底层通过fs.open(path,flags)打开文件
  // encoding 读取文件的编码 模式读取为buffer
  // fd 传递了 r 和 path 可以不用传递这个fd文件表示符
  highWaterMark: 3, // 单位为字节 默认为64KB = 1024 * 64，意为分批每次读取最大个数
  start: 0,
  end: 5, // start 和 end 表示总共需要读取文件的字节数，从start-end 0-5 表示总共读取6个字节
  autoClose: true, // 读取完是否自动关闭
  emitClose: true, // 关闭时时候触发事件
  // mode 类似于Linux中的操作系统权限 默认 0o666 类似于777最大权限
});

// 底层还是基于Events 发布订阅模式去实现 它是继承了这个类
rs.on('open', (fd) => {
  // 之后文件才有存在fd
  console.log('可读流打开文件时', fd);
});

rs.on('data', (chunk) => {
  console.log(chunk);
  // 暂停
  rs.pause();
});

rs.on('end', () => {
  console.log('读取完毕');
});

rs.on('close', () => {
  console.log('关闭可读流');
});

// 读取可以控制速率 可以暂停读取
setTimeout(() => {
  // 恢复暂停的可读流
  console.log('恢复可读流');
  rs.resume();
}, 2000);
