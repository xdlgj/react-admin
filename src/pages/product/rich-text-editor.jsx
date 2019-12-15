/*
用来指定商品详情的富文本编辑器组件
*/

import React, { Component } from 'react'
import {PropTypes} from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'



export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }
    constructor(props){
        super(props)
        const html = this.props.detail
        if (html){//如果有值，根据html格式字符串创建一个对应的编辑对象
            const contentBlock = htmlToDraft(html)  
            const contentState = ContentState.createFromBlockArray(contentBlock)
            const editorState = EditorState.createWithContent(contentState)
            this.state = {
                editorState
            }
        }else{
            this.state = {
                editorState: EditorState.createEmpty()
            }
        }
    }
    /*
    富文本编辑器上传图片
    */
    uploadImageCallBack = (file) =>{
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open("POST", '/manage/img/upload')
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', ()=>{
                    const response = JSON.parse(xhr.responseText)
                    const {url} = response.data //得到图片的url
                    resolve({data:{link: url}})
                })
                xhr.addEventListener('error', ()=>{
                    const error = JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }
  /*
  输入过程中实时的回调
  */
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
  getDetail = () => {
      //返回输入数据对应的html格式文本
      return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  render() {
    const { editorState } = this.state;
    return (
        <Editor
            editorState={editorState}
            editorStyle={{border: '1px solid black', minHeight:200, padding:10}}
            onEditorStateChange={this.onEditorStateChange}
            toolbar={{
                image: {uploadCallback: this.uploadImageCallBack, alt:{present: true, mandatory: true}}
            }}
        />
    );
  }
}