import React, {Component} from 'react'
import { Upload, Icon, Modal, message} from 'antd'
import {reqDeleteImg} from '../../api'
import {PropTypes} from 'prop-types'
import {BASE_IMG_URL} from '../../utils/constants'

/*
上传图片的组件
*/

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default class PicturesWall extends Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  constructor (props){
      super(props)
      let fileList = []
      //如果传入names属性
      const {imgs} = this.props
      if(imgs && imgs.length > 0){
          fileList = imgs.map((img, index)=>({
            uid: -index,
            name: img,
            status: 'done',
            url : BASE_IMG_URL + img
          }))
      }
      //初始化状态
      this.state = {
        previewVisible: false, // 标识是否显示大图预览Modal
        previewImage: '', // 大图的url
        fileList
      }
  }
  /*
  获取图片名的列表，通过ref传递给父组件
  */
  getImgs = () => this.state.fileList.map(file=>file.name)
  /*
  隐藏Modal
  */
  handleCancel = () => this.setState({ previewVisible: false });
  /*
  点击图片上面的小眼睛触发（查看大图）
  */
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    //显示指定file对应的大图
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  /*
    file: 当前操作的图片文件（上传/删除）
    fileList：所有已上传图片文件对象数组包括当前操作的状态为uploading的图片
  */
  handleChange = async ({file, fileList }) => {
      //一旦上传成功，将当前上传的file的信息修正（name， url）
      if(file.status==='done'){
        const result = file.response
        if(result.status===0){
            message.success('上传成功')
            const {name, url} = result.data
            file = fileList[fileList.length-1]

            file.name = name
            file.url = url
        }else{
            message.success('上传失败')
        }
      }else if(file.status==='removed'){//删除图片
        const {name} = file
        const result = await reqDeleteImg(name)
        if(result.status===0){
            message.success("删除图片成功")
        }else{
            message.error("删除图片失败")
        }

      }
      //在操作（上传/删除）过程中更新fileList状态
      this.setState({fileList})
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" //上传图片的接口地址
          accept='image/*' //只接收图片格式
          name='image' //请求参数名
          listType="picture-card" //卡片样式
          fileList={fileList} //所有已上传图片文件对象的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}