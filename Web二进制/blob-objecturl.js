const name = JSON.stringify({
  name: '19QIngfeng',
});

// 传入DOMString创建blob
const blob = new Blob([name], {
  type: 'application/json',
});

// 创建 Object Url
const url = URL.createObjectURL(blob);

const aLink = document.createElement('a');

// href属性
aLink.href = url;
// 定义下载的文件名
aLink.download = 'name.json';

// 派发a链接的点击事件
aLink.dispatchEvent(new MouseEvent('click'));

// 下载完成后，释放 URL.createObjectURL() 创建的 URL 对象。
URL.revokeObjectURL(url);
/**
 *
 * @param {*} blob blob 对象
 * @param {*} type 输出的结果
 */
function getBlobByType(blob, type) {
  const fileReader = new FileReader(blob);
  switch (type) {
    // 读取文件的 ArrayBuffer 数据对象.
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
    // 读取文件为文件的原始二进制数据（已废弃不推荐使用）
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

// ArrayBuffer 对象
getBlobByType(blob, 'arrayBuffer').then((res) => console.log(res));

// {"name":"19QIngfeng"}
getBlobByType(blob, 'DOMstring').then((res) => console.log(res));

// data:application/json;base64,eyJuYW1lIjoiMTlRSW5nZmVuZyJ9
getBlobByType(blob, 'dataUrl').then((res) => console.log(res));

// {"name":"19QIngfeng"}
getBlobByType(blob, 'binaryString').then((res) => console.log(res));
