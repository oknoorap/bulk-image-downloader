import path from 'path'
import React, { Component } from 'react'
import styled from 'styled-components'
import jszip from 'jszip'
import uniq from 'lodash.uniq'
import isUrl from 'is-url'
import i2b64 from 'imageurl-base64'
import { saveAs } from 'file-saver'
import Loader from './loader'

const Wrapper = styled.div`
  margin: 20px auto;
  width: 60%;
  font-family: sans-serif;
  font-size: 16px;
  display: flex;
  flex-direction: column;
`

const Header = styled.header`
  margin-bottom: 20px;

  h1 {
    font-size: 2rem;
    margin: 0;
  }

  p {
    margin: 5px 0;
  }
`

const URLBox = styled.textarea`
  height: 200px;
  padding: 10px;
  font-size: 1rem;
  outline: none;
`

const DownloadButton = styled.button`
  background: #15a1ea;
  color: #fff;
  min-width: 200px;
  max-width: 330px;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 1rem;
  padding: 15px;
  font-weight: 600;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`

const LoaderWrapper = styled.div`
  margin: 20px 0;
  display: flex;
  align-items: center;
`

const TryButton = DownloadButton.extend``

const ErrorInfo = styled.div`
  margin-top: 20px;

  strong {
    margin-bottom: 10px;
  }

  ul {
    margin: 0;
    padding: 0;
    color: #cc0000;
    list-style: square;
  }

  li {
    padding: 0;
    margin: 0 0 5px 20px;
  }
`

class App extends Component {
  state = {
    onProgress: false,
    finish: false,
    errors: []
  }

  constructor(props) {
    super(props)
    this.urlBox = React.createRef()
    this.downloadBtn = React.createRef()
  }

  downloadImages = async () => {
    let urls = this.urlBox.value.replace(/[\n\r]/g, '\\n').split('\\n')
    urls = uniq(urls)
    urls = urls.filter(item => isUrl(item))

    await this.setState({
      onProgress: true
    })

    await Promise.all(
      urls.map((url, index) => new Promise(async (resolve) => {
        const $index = index + 1

        await i2b64(url, async (err, data) => {
          if (err) {
            this.state.errors.push({
              index: $index,
              url
            })
            await this.setState({
              ...this.setState
            })
            return resolve({})
          }

          const { mimeType, base64 } = data
          const ext = mimeType.split('/')
          const pathName = path.basename(url, path.extname(url))
          resolve({
            name: `${$index}-${pathName}`,
            image: base64,
            ext: ext[ext.length - 1]
          })
        })
      }))
    ).then(items => {
      var zip = new jszip()

      const fileName = `images-${Date.now()}`
      const img = zip.folder(fileName)
      items.forEach(item => {
        if (item.name) {
          img.file(`${item.name}.${item.ext}`, item.image, {base64: true})
        }
      })

      zip.generateAsync({type: 'blob'}).then(async content => {
        await saveAs(content, `${fileName}.zip`)
        this.setState({
          finish: true
        })
      })
    })
  }

  tryAgain = () => {
    this.setState({
      onProgress: false,
      finish: false,
      errors: []
    })
  }

  render() {
    return (
      <Wrapper className="App">
        <Header className="App-header">
          <h1 className="App-title">Bulk Image Downloder</h1>
          <p>Download ZIP of Images from URLs you've collected.</p>
        </Header>

        <URLBox innerRef={component => this.urlBox = component} placeholder="Insert URLs Here..." disabled={this.state.onProgress} />
        {
          this.state.onProgress
            ? !this.state.finish && (
              <LoaderWrapper><Loader /> Downloading...</LoaderWrapper>
            )
            : <DownloadButton innerRef={component => this.downloadBtn = component} onClick={this.downloadImages}>Download Images</DownloadButton>
        }
        {this.state.onProgress && this.state.errors.length > 0 && (
          <ErrorInfo>
            <strong>Error Download</strong>
            <ul>
            {
              this.state.errors.map((item, key) => {
                return (
                  <li key={key}>Image #{item.index} &middot; {item.url}</li>
                )
              })
            }
            </ul>
          </ErrorInfo>
        )}
        {this.state.finish && (
          <TryButton onClick={this.tryAgain}>Success Downloaded, Try Again?</TryButton>
        )}
      </Wrapper>
    )
  }
}

export default App
