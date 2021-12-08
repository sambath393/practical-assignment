import { Button, Layout } from 'antd'
import React from 'react'

export default function Navbar({ user, setUser }) {
    return (
        <Layout.Header
            className="site-layout-background"
            style={{
                textAlign: "right"
            }}
        >
            {
                !user ? <Button
                    shape="round"
                    onClick={() => setUser(e => !e)}
                >
                    Login
                </Button> : <Button
                    onClick={() => setUser(e => !e)}
                    shape="round"
                    danger
                >
                    Logout
                </Button>
            }

        </Layout.Header>
    )
}
