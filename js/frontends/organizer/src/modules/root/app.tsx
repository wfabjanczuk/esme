import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { Router } from './router'
import './reset.css'

export const App = (): JSX.Element => <RouterProvider router={Router} />
