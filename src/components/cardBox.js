import { HeartOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'

export default function CardBox({ data, user }) {
    return (
        <div className="card" key={data.id}>
            <img
                className="card--image"
                alt={data.alt_description}
                src={data.urls.small}
                width="100%"
            />
            {
                user &&
                <Button
                    className="card-likeBtn"
                    shape="circle"
                    icon={<HeartOutlined />}
                    size="large"
                />
            }

        </div>
    )
}
