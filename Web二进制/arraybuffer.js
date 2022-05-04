// 创建8个字节长度的缓存冲
// const buffer = new ArrayBuffer(8);

// // 根据传入的buffer 从第一个字节开始，并且字节长度为匹配buffer的长度
// const dataView = new DataView(buffer);

// // 将DataView中偏移量为0个字节的字节，也就是第一个字节设置为十进制的1
// dataView.setUint8(0, 1);
// // 将DataView中偏移量为1个字节的字节，也就是第二个字节设置为十进制的2
// dataView.setUint8(1, 2);

// // 从dataView中偏移第0个字节，也就是第一个字节，获取8位
// // log: 1
// dataView.getUint8(0);

// // 从dataView中偏移第一个字节获取八位，也就是获取第二个字节的值
// // log: 2
// dataView.getUint8(1);

// // 偏移量为0个字节，获取后续16位大小（也就是获取前两个字节大小）
// // log: 258
// dataView.getUint16(0);

// // 偏移量为2个字节，设置后16位大小为256（也就是设置第三个字节和第四个字节大小和为256）
// dataView.setUint16(2, 256);

// // 偏移量为2个字节，获取后16位大小
// // log: 256
// dataView.getUint16(2);

// // 这里应该是258
// // console.log(dataView.getUint16(0));

// // 这里应该是256
// // console.log(dataView.getUint16(2));

const name = JSON.stringify({ name: '19QIngfeng' });

// 传入DOMString创建blob
const blob = new Blob([name], {
  type: 'application/json',
});

/**
 *
 * @param {*} blob blob 对象
 * @param {*} type 输出的结果
 */
function getBlobByType(blob, type) {
  const fileReader = new FileReader(blob);
  switch (type) {
    //  读取文件的 ArrayBuffer 数据对象.
    case 'arrayBuffer':
      fileReader.readAsArrayBuffer(blob);
      break;
    // 读取文件为的字符串
    case 'DOMstring':
      fileReader.readAsText(blob, 'utf8');
      break;
    // 读取文件为data: URL格式的Base64字符串
    case 'dataUrl':
      fileReader.readAsDataURL(blob);
      break;
    // 读取文件为文件的原始二进制数据
    case 'binaryString':
      fileReader.readAsBinaryString(blob);
      break;
    default:
      break;
  }

  return new Promise((resolve) => {
    // 当文件读取完成时候触发
    fileReader.onload = (e) => {
      // 获取最终读取结果
      const result = e.target.result;
      resolve(result);
    };
  });
}

getBlobByType(blob, 'arrayBuffer').then((res) => console.log(res));

getBlobByType(blob, 'DOMstring').then((res) => console.log(res));

getBlobByType(blob, 'dataUrl').then((res) => console.log(res));

getBlobByType(blob, 'binaryString').then((res) => console.log(res));
