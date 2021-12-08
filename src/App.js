import './App.css';
import { AutoComplete, Button, Col, Empty, Layout, Row, Skeleton } from 'antd'
import { useState } from 'react';
import { createApi, } from "unsplash-js";
import { SearchOutlined } from '@ant-design/icons';
import { autocompleteFn } from './functions/fn';
import CardBox from './components/cardBox';
import InfiniteScroll from 'react-infinite-scroll-component';
import Navbar from './components/navbar';

const unsplash = createApi({
  accessKey: process.env.REACT_APP_ACCESS_KEY,
});

function App() {
  const [data, setData] = useState({
    results: []
  })
  const [options, setOptions] = useState([]);
  const [user, setUser] = useState(false)

  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false);

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
        result = await unsplash.photos.list({ page: page, perPage: 10 })
          .then(({ response }) => {
            return response
          })
      } else {
        result = await unsplash.search.getPhotos({
          query: keyword,
          page: page,
          perPage: 10,
        }).then(({ response }) => {
          console.log(response)
          return response
        })
      }

      setData(result)

      setOptions(autocompleteFn(options, keyword))
    } catch (error) {
      console.log(error)
    }
  }

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    let result = []
    if (keyword === "") {
      result = await unsplash.photos.list({ page: page + 1, perPage: 10 })
        .then(({ response }) => {
          return response
        })
    } else {
      result = await unsplash.search.getPhotos({
        query: keyword,
        page: page + 1,
        perPage: 10,
      }).then(({ response }) => {
        console.log(response)
        return response
      })
    }

    setData(e => {
      return {
        ...e,
        results: [
          ...e.results,
          ...result.results,
        ]
      }
    })
    setPage(e => e + 1)

    setLoading(false)
  };

  return (
    <div className="App">
      <Layout
        className="site-layout"
        style={{ minHeight: "100vh" }}
      > 
        <Navbar user={user} setUser={setUser} />
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
                <div
                  id="scrollableDiv"
                  style={{
                    height: "75vh",
                    overflow: 'auto',
                  }}
                >
                  <InfiniteScroll
                    dataLength={data?.results?.length}
                    next={loadMoreData}
                    hasMore={data?.results?.length < data?.total}
                    loader={<Skeleton paragraph={{ rows: 1 }} active />}
                    endMessage={<Empty
                      description={
                        <span>
                          No Found
                        </span>
                      }
                    />}
                    scrollableTarget="scrollableDiv"
                  >
                     <div className="card-list">
                        {
                          data?.results?.map(load =>
                            <CardBox data={load} user={user} />
                          )
                        }
                      </div>
                  </InfiniteScroll>
                </div>
              </Col>

            </Row>
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default App;
