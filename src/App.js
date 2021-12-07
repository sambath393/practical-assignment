import './App.css';
import { AutoComplete, Button, Col, Empty, Layout, Row } from 'antd'
import { useState } from 'react';
import { createApi } from "unsplash-js";
import { SearchOutlined } from '@ant-design/icons';
import { autocompleteFn } from './functions/fn';
import axios from 'axios';

const unsplash = createApi({
  accessKey: process.env.REACT_APP_ACCESS_KEY,
});

function App() {
  const [data, setData] = useState([])
  const [options, setOptions] = useState([]);

  const [keyword, setKeyword] = useState("")

  const testFn = () => {
    axios({
      method: "get",
      url: `https://unsplash.com/oauth/authorize`,
      params: {
        client_id: process.env.REACT_APP_ACCESS_KEY,
        redirect_uri: process.env.REACT_APP_URI,
        response_type: "code",
      },
    }).then(response => {
      console.log(response)
    })
  }


  const onSearch = async (e) => {
    setKeyword(e)

    let rememberData = localStorage.getItem("@remember") ? JSON.parse(localStorage.getItem("@remember")) : []

    setOptions(rememberData)
  }

  const onSelect = async (e) => {
    setKeyword(e)
  }

  const onFinish = async () => {
    try {
      let result = []
      if (keyword === "") {
        result = await unsplash.photos.list({ page: 2, perPage: 15 })
          .then(({ response }) => {
            return response.results
          })
      } else {
        result = await unsplash.search.getPhotos({
          query: keyword,
          page: 1,
          perPage: 10,
        }).then(({ response }) => {
          console.log(response)
          return response.results
        })
      }

      setData(result)

      setOptions(autocompleteFn(options, keyword))

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
      <Layout
        className="site-layout"
        style={{ minHeight: "100vh" }}>
        <Layout.Header
          className="site-layout-background"
        >
          <Button
            onClick={() => testFn()}
          >
            test
          </Button>
        </Layout.Header>
        <Layout.Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div className="container">
            <Row
              gutter={[16, 16]}
            >
              <Col
                xs={24}
                md={24}
              >
                <Row>
                  <Col
                    xs={20}
                    md={20}
                  >
                    <AutoComplete
                      options={options}
                      style={{
                        width: "100%",
                      }}
                      onSelect={onSelect}
                      onSearch={onSearch}
                      onKeyDown={(e) => e.nativeEvent.key === "Enter" && onFinish()}
                      placeholder="Search..."
                      size="large"
                    />
                  </Col>
                  <Col
                    xs={4}
                    md={4}
                  >
                  <Button
                    onClick={() => onFinish()}
                    icon={<SearchOutlined />}
                    size="large"
                    style={{
                      width: "100%",
                    }}
                  >
                    Search
                  </Button>

                  </Col>
                </Row>
              </Col>
              <Col
                xs={24}
              >
                {data.length === 0 ? <Empty
                  description={
                    <span>
                      No Found
                    </span>
                  }
                /> :
                  <div className="card-list">
                    {
                      data?.map(load =>
                        <div className="card">
                          <img
                            className="card--image"
                            alt={load.alt_description}
                            src={load.urls.small}
                            width="50%"
                            height="50%"
                          ></img>
                        </div>)
                    }
                  </div>
                }
              </Col>

            </Row>
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default App;
