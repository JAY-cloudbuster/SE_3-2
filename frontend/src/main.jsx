/**
 * @fileoverview Application Entry Point for AgriSahayak Frontend
 * 
 * This is the root file that bootstraps the React application.
 * It creates the React root element, mounts the App component
 * to the DOM, and imports global CSS styles.
 * 
 * Note: React.StrictMode is intentionally not used here to avoid
 * double-rendering in development mode, which can cause issues
 * with Socket.io connections and translation API calls.
 * 
 * @module main
 * @requires react - React library
 * @requires react-dom/client - React DOM rendering
 * @requires App - Root application component
 * @requires index.css - Global CSS styles (Tailwind + custom styles)
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * Mount the React application to the DOM.
 * 
 * Finds the HTML element with id="root" (in index.html)
 * and renders the App component tree inside it.
 * The App component wraps the entire application with
 * context providers (Auth, Translation, Language, Socket).
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)