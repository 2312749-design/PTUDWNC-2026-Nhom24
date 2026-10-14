(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/App.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-router/dist/development/chunk-OB3PAWPO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-oauth/google/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$routes$2f$wizard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/routes/wizard.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/CommunityPages.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/PlatformFeaturePages.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/LocaleContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/config.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/auth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
const API_V1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVersionedApiBaseUrl"])();
function getStoredToken() {
    const token = localStorage.getItem('accessToken') || '';
    if (!token) return '';
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        if (!payload.exp || payload.exp * 1000 <= Date.now()) return '';
        return token;
    } catch  {
        localStorage.removeItem('accessToken');
        return '';
    }
}
async function getFreshAccessToken() {
    const validToken = getStoredToken();
    if (validToken) return validToken;
    const refreshToken = localStorage.getItem('refreshToken') || '';
    if (!refreshToken) return '';
    try {
        const response = await fetch(`${API_V1}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken
            })
        });
        const data = await safeReadJson(response);
        if (!response.ok || !data.accessToken || !data.refreshToken) throw new Error('Refresh token is no longer valid.');
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        window.dispatchEvent(new Event('auth-session-refreshed'));
        return data.accessToken;
    } catch  {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return '';
    }
}
function ProtectedRoute({ children }) {
    const token = getStoredToken() || localStorage.getItem('refreshToken');
    if (!token) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Navigate"], {
            to: "/login",
            replace: true
        }, void 0, false, {
            fileName: "[project]/src/App.jsx",
            lineNumber: 60,
            columnNumber: 12
        }, this);
    }
    return children;
}
_c = ProtectedRoute;
function generateCaptcha() {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    return {
        question: `${a} + ${b} = ?`,
        answer: String(a + b)
    };
}
async function readApiResponse(response) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readApiResponse"])(response);
}
async function safeReadJson(response) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readApiResponse"])(response);
}
function LoginPage() {
    _s();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        username: '',
        password: ''
    });
    const [tokenInput, setTokenInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleSubmit = async (event)=>{
        event.preventDefault();
        if (!form.username.trim() || !form.password.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng nhập tên đăng nhập và mật khẩu.');
            return;
        }
        try {
            const payload = {
                password: form.password,
                ...form.username.includes('@') ? {
                    email: form.username.trim()
                } : {
                    username: form.username.trim()
                }
            };
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["login"])(payload);
            if (!result.ok) {
                throw new Error(result.message);
            }
            localStorage.setItem('accessToken', result.data.accessToken);
            localStorage.setItem('refreshToken', result.data.refreshToken);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(result.message || 'Đăng nhập thành công!');
            navigate('/home');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const handleGoogleLogin = async (credentialResponse)=>{
        const idToken = credentialResponse?.credential;
        if (!idToken) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Google không trả về ID token hợp lệ.');
            return;
        }
        try {
            const response = await fetch(`${API_V1}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idToken
                })
            });
            const data = await readApiResponse(response);
            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập bằng Google thất bại.');
            }
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken || '');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(data.message || 'Đăng nhập Google thành công!');
            navigate('/home');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const handleTokenLogin = ()=>{
        const token = tokenInput.trim();
        if (!token) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng dán mã JWT.');
            return;
        }
        const parts = token.split('.');
        if (parts.length !== 3 || !parts.every(Boolean)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Token không hợp lệ.');
            return;
        }
        localStorage.setItem('accessToken', token);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đăng nhập bằng mã truy cập thành công.');
        navigate('/home');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page-shell",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "auth-card",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    children: "Đăng nhập"
                }, void 0, false, {
                    fileName: "[project]/src/App.jsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Tên đăng nhập"
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 173,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Nhập tên đăng nhập",
                                    value: form.username,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            username: event.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Mật khẩu"
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 182,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    placeholder: "Nhập mật khẩu",
                                    value: form.password,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            password: event.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 183,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 181,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "primary-btn",
                            children: "Đăng nhập"
                        }, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/App.jsx",
                    lineNumber: 171,
                    columnNumber: 9
                }, this),
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleLogin"], {
                    onSuccess: handleGoogleLogin,
                    onError: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Đăng nhập Google thất bại.')
                }, void 0, false, {
                    fileName: "[project]/src/App.jsx",
                    lineNumber: 194,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "secondary-btn",
                    type: "button",
                    disabled: true,
                    children: "Google OAuth chưa được cấu hình"
                }, void 0, false, {
                    fileName: "[project]/src/App.jsx",
                    lineNumber: 199,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "token-box",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "Đăng nhập bằng mã truy cập"
                        }, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 205,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "Dán mã JWT",
                            value: tokenInput,
                            onChange: (event)=>setTokenInput(event.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "primary-btn",
                            type: "button",
                            onClick: handleTokenLogin,
                            children: "Xác nhận"
                        }, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 212,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/App.jsx",
                    lineNumber: 204,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "switch-text",
                    children: [
                        "Chưa có tài khoản? ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                            to: "/register",
                            children: "Đăng ký ngay"
                        }, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 218,
                            columnNumber: 30
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/App.jsx",
                    lineNumber: 217,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/App.jsx",
            lineNumber: 169,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/App.jsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "Jlip6bxbDzvZem1GW60Ame2kG6E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"]
    ];
});
_c1 = LoginPage;
function RegisterPage() {
    _s1();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const [captcha, setCaptcha] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(generateCaptcha());
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        captchaInput: ''
    });
    const captchaReady = form.captchaInput.trim() === captcha.answer;
    const refreshCaptcha = ()=>{
        setCaptcha(generateCaptcha());
        setForm((current)=>({
                ...current,
                captchaInput: ''
            }));
    };
    const handleSubmit = async (event)=>{
        event.preventDefault();
        if (!form.fullName.trim() || !form.username.trim() || !form.email.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng nhập họ tên, username và email.');
            return;
        }
        if (!form.password || !form.confirmPassword) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng nhập mật khẩu và xác nhận mật khẩu.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Mật khẩu xác nhận không khớp.');
            return;
        }
        if (!captchaReady) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Captcha chưa đúng, vui lòng kiểm tra lại.');
            return;
        }
        try {
            const response = await fetch(`${API_V1}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: form.username.trim(),
                    email: form.email.trim(),
                    fullName: form.fullName.trim(),
                    password: form.password,
                    confirmPassword: form.confirmPassword,
                    captchaQuestion: captcha.question,
                    captchaAnswer: form.captchaInput
                })
            });
            const data = await readApiResponse(response);
            if (!response.ok) {
                throw new Error(data.message || 'Đăng ký thất bại.');
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(data.message || 'Đăng ký thành công!');
            setTimeout(()=>navigate('/login'), 1000);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page-shell",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "auth-card",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    children: "Đăng ký"
                }, void 0, false, {
                    fileName: "[project]/src/App.jsx",
                    lineNumber: 298,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Họ và tên"
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 302,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Tên hiển thị của bạn",
                                    value: form.fullName,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            fullName: event.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 303,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 301,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Username"
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 306,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Nhập username",
                                    value: form.username,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            username: event.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 307,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 305,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Email"
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 315,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    placeholder: "ban@email.com",
                                    value: form.email,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            email: event.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 314,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Password"
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 319,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    placeholder: "Nhập mật khẩu",
                                    value: form.password,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            password: event.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 320,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 318,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Xác nhận Password"
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 328,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    placeholder: "Nhập lại mật khẩu",
                                    value: form.confirmPassword,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            confirmPassword: event.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 329,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 327,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Captcha"
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 337,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "captcha-box",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: captcha.question
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 339,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 338,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Nhập đáp án",
                                    value: form.captchaInput,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            captchaInput: event.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 341,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "tiny-btn",
                                    onClick: refreshCaptcha,
                                    children: "Làm mới captcha"
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 347,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 336,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "primary-btn",
                            disabled: !captchaReady,
                            children: "Đăng ký"
                        }, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 352,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/App.jsx",
                    lineNumber: 300,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/App.jsx",
            lineNumber: 297,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/App.jsx",
        lineNumber: 296,
        columnNumber: 5
    }, this);
}
_s1(RegisterPage, "DdeyRLgAeZPxFuH1Q/TOUIMI5fg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"]
    ];
});
_c2 = RegisterPage;
function RecipeDetailPage() {
    _s2();
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const [recipe, setRecipe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const fetchRecipe = async ()=>{
        const token = getStoredToken();
        try {
            const recipePath = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ? `/recipes/${id}` : `/recipes/slug/${encodeURIComponent(id)}`;
            const response = await fetch(`${API_V1}${recipePath}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorData = await safeReadJson(response);
                throw new Error(errorData.message || 'Không thể tải thông tin món ăn.');
            }
            const data = await safeReadJson(response);
            setRecipe(data);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RecipeDetailPage.useEffect": ()=>{
            fetchRecipe();
        }
    }["RecipeDetailPage.useEffect"], [
        id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RecipeDetailPage.useEffect": ()=>{
            const activeToken = getStoredToken();
            if (activeToken) fetch(`${API_V1}/recipes/${id}/view`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${activeToken}`
                }
            }).catch({
                "RecipeDetailPage.useEffect": ()=>{}
            }["RecipeDetailPage.useEffect"]);
        }
    }["RecipeDetailPage.useEffect"], [
        id
    ]);
    const handleDelete = async ()=>{
        if (!window.confirm('Bạn có chắc muốn xóa món ăn này?')) {
            return;
        }
        const token = getStoredToken();
        try {
            const response = await fetch(`${API_V1}/recipes/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await safeReadJson(response);
            if (!response.ok) {
                throw new Error(data.message || 'Xóa món ăn thất bại.');
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(data.message || 'Xóa món ăn thành công.');
            navigate('/recipes');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "page-shell",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "recipe-detail-card",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: t('Đang tải chi tiết món ăn...')
                }, void 0, false, {
                    fileName: "[project]/src/App.jsx",
                    lineNumber: 436,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 435,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/App.jsx",
            lineNumber: 434,
            columnNumber: 7
        }, this);
    }
    if (!recipe) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "page-shell",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "recipe-detail-card empty-state",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: t('Không tìm thấy món ăn.')
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 446,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                        to: "/recipes",
                        className: "primary-btn inline-link",
                        children: t('Quay lại danh sách')
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 447,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 445,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/App.jsx",
            lineNumber: 444,
            columnNumber: 7
        }, this);
    }
    const ingredientLines = recipe.recipeIngredients?.length ? recipe.recipeIngredients.map((item)=>[
            item.quantity,
            item.unit,
            item.name
        ].filter(Boolean).join(' ')) : recipe.ingredients || [];
    const instructionLines = recipe.recipeSteps?.length ? recipe.recipeSteps.map((item)=>[
            item.title,
            item.description
        ].filter(Boolean).join(': ')) : recipe.instructions || [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommunityNav"], {}, void 0, false, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 461,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-shell",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "recipe-detail-shell",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "recipe-detail-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "recipe-detail-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "eyebrow",
                                                children: t('Recipe Detail')
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 466,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                children: t(recipe.title)
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 467,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "meta-chip",
                                                children: t(recipe.categoryName || 'Chưa phân loại')
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 468,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 465,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "detail-actions",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                to: "/recipes",
                                                className: "secondary-btn inline-link",
                                                children: t('Quay lại')
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 472,
                                                columnNumber: 15
                                            }, this),
                                            getStoredToken() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "small-btn edit",
                                                        onClick: ()=>navigate('/recipes'),
                                                        children: t('Sửa')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 474,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "small-btn delete",
                                                        onClick: handleDelete,
                                                        children: t('Xóa')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 475,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 473,
                                                columnNumber: 36
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 471,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 464,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "recipe-detail-main",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "recipe-detail-identity-panel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "detail-label",
                                                children: "ID"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 482,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "detail-id-box",
                                                children: recipe.id
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 483,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 481,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "recipe-detail-content",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "recipe-meta",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "status-badge",
                                                        children: t(recipe.status === 1 ? 'Published' : recipe.status === 2 ? 'Archived' : 'Draft')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 489,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "meta-chip",
                                                        children: [
                                                            t('Danh mục:'),
                                                            " ",
                                                            t(recipe.categoryName || 'Chưa phân loại')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 490,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "meta-chip",
                                                        children: [
                                                            t('Tác giả:'),
                                                            " ",
                                                            recipe.authorId || 'System'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 491,
                                                        columnNumber: 17
                                                    }, this),
                                                    recipe.cookingTimeMinutes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "meta-chip",
                                                        children: [
                                                            "⏱ ",
                                                            recipe.cookingTimeMinutes,
                                                            " ",
                                                            t('phút')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 492,
                                                        columnNumber: 47
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "meta-chip",
                                                        children: [
                                                            "Prep ",
                                                            recipe.prepTimeMinutes,
                                                            "m · Cook ",
                                                            recipe.cookTimeMinutes,
                                                            "m · ",
                                                            recipe.servings,
                                                            " servings"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 493,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "meta-chip",
                                                        children: [
                                                            t('Độ khó:'),
                                                            " ",
                                                            t(recipe.difficulty || 'Trung bình')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 494,
                                                        columnNumber: 17
                                                    }, this),
                                                    recipe.isVegetarian && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "meta-chip",
                                                        children: t('Món chay')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 495,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 488,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "recipe-detail-section",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: t('Mô tả')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 499,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: t(recipe.description || 'Chưa có mô tả.')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 500,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 498,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "recipe-detail-grid",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "recipe-detail-section",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                children: t('Nguyên liệu')
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 505,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                children: ingredientLines.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: t(item)
                                                                    }, `${recipe.id}-ingredient-${index}`, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 508,
                                                                        columnNumber: 23
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 506,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 504,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "recipe-detail-section",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                children: t('Các bước làm')
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 514,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                                                children: instructionLines.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: t(item)
                                                                    }, `${recipe.id}-instruction-${index}`, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 517,
                                                                        columnNumber: 23
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 515,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 513,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 503,
                                                columnNumber: 15
                                            }, this),
                                            recipe.nutrition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "recipe-detail-section",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: "Nutrition (mỗi khẩu phần)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 523,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "recipe-meta",
                                                        children: [
                                                            recipe.nutrition.calories != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "meta-chip",
                                                                children: [
                                                                    recipe.nutrition.calories,
                                                                    " kcal"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 525,
                                                                columnNumber: 57
                                                            }, this),
                                                            recipe.nutrition.protein != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "meta-chip",
                                                                children: [
                                                                    "Protein ",
                                                                    recipe.nutrition.protein,
                                                                    " g"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 526,
                                                                columnNumber: 56
                                                            }, this),
                                                            recipe.nutrition.carbohydrates != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "meta-chip",
                                                                children: [
                                                                    "Carbohydrates ",
                                                                    recipe.nutrition.carbohydrates,
                                                                    " g"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 527,
                                                                columnNumber: 62
                                                            }, this),
                                                            recipe.nutrition.fat != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "meta-chip",
                                                                children: [
                                                                    "Fat ",
                                                                    recipe.nutrition.fat,
                                                                    " g"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 528,
                                                                columnNumber: 52
                                                            }, this),
                                                            recipe.nutrition.fiber != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "meta-chip",
                                                                children: [
                                                                    "Fiber ",
                                                                    recipe.nutrition.fiber,
                                                                    " g"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 529,
                                                                columnNumber: 54
                                                            }, this),
                                                            recipe.nutrition.sodium != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "meta-chip",
                                                                children: [
                                                                    "Sodium ",
                                                                    recipe.nutrition.sodium,
                                                                    " mg"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 530,
                                                                columnNumber: 55
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 524,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 522,
                                                columnNumber: 36
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 487,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 480,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RecipeEngagement"], {
                                recipe: recipe
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 535,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 463,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/App.jsx",
                    lineNumber: 462,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 461,
                columnNumber: 23
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/App.jsx",
        lineNumber: 461,
        columnNumber: 5
    }, this);
}
_s2(RecipeDetailPage, "DNFRzeePEDJi5iWuavl+z1Okxd8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c3 = RecipeDetailPage;
function CategoriesPage() {
    _s3();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recipes, setRecipes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        description: '',
        imageUrl: ''
    });
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFormOpen, setIsFormOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadingImage, setUploadingImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedCategoryId, setSelectedCategoryId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const token = getStoredToken() || localStorage.getItem('refreshToken') || '';
    const fetchCatalog = async ()=>{
        setLoading(true);
        try {
            const [categoryResponse, recipeResponse] = await Promise.all([
                fetch(`${API_V1}/categories`),
                fetch(`${API_V1}/recipes`)
            ]);
            if (!categoryResponse.ok || !recipeResponse.ok) throw new Error('Không thể tải danh mục và công thức.');
            const [categoryData, recipeData] = await Promise.all([
                readApiResponse(categoryResponse),
                readApiResponse(recipeResponse)
            ]);
            setCategories(categoryData);
            setRecipes(recipeData);
            setSelectedCategoryId((current)=>current && categoryData.some((category)=>category.id === current) ? current : null);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CategoriesPage.useEffect": ()=>{
            fetchCatalog();
        }
    }["CategoriesPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CategoriesPage.useEffect": ()=>{
            if (!selectedCategoryId) return undefined;
            const previousOverflow = document.body.style.overflow;
            const closeOnEscape = {
                "CategoriesPage.useEffect.closeOnEscape": (event)=>{
                    if (event.key === 'Escape') setSelectedCategoryId(null);
                }
            }["CategoriesPage.useEffect.closeOnEscape"];
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', closeOnEscape);
            return ({
                "CategoriesPage.useEffect": ()=>{
                    document.body.style.overflow = previousOverflow;
                    window.removeEventListener('keydown', closeOnEscape);
                }
            })["CategoriesPage.useEffect"];
        }
    }["CategoriesPage.useEffect"], [
        selectedCategoryId
    ]);
    const resetForm = ()=>{
        setForm({
            name: '',
            description: '',
            imageUrl: ''
        });
        setEditingId(null);
        setIsFormOpen(false);
    };
    const handleSubmit = async (event)=>{
        event.preventDefault();
        if (!form.name.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Tên danh mục không được để trống.');
            return;
        }
        const activeToken = await getFreshAccessToken();
        if (!activeToken) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Phiên đã hết hạn. Vui lòng đăng nhập lại để lưu thay đổi.');
            navigate('/login');
            return;
        }
        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            imageUrl: form.imageUrl || null
        };
        try {
            const response = await fetch(`${API_V1}/categories${editingId ? `/${editingId}` : ''}`, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${activeToken}`
                },
                body: JSON.stringify(payload)
            });
            const data = await safeReadJson(response);
            if (!response.ok) {
                throw new Error(data.message || 'Thao tác danh mục thất bại.');
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(editingId ? 'Cập nhật danh mục thành công.' : 'Thêm danh mục thành công.');
            resetForm();
            await fetchCatalog();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const handleEdit = (category)=>{
        setEditingId(category.id);
        setForm({
            name: category.name,
            description: category.description || '',
            imageUrl: category.imageUrl || ''
        });
        setIsFormOpen(true);
    };
    const handleImageUpload = async (event)=>{
        const file = event.target.files?.[0];
        if (!file) return;
        if (![
            'image/jpeg',
            'image/png',
            'image/webp'
        ].includes(file.type) || file.size > 5 * 1024 * 1024) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chọn ảnh JPG, PNG hoặc WebP không quá 5 MB.');
            event.target.value = '';
            return;
        }
        const activeToken = await getFreshAccessToken();
        if (!activeToken) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Phiên đã hết hạn. Vui lòng đăng nhập lại để tải ảnh.');
            navigate('/login');
            return;
        }
        const body = new FormData();
        body.append('file', file);
        setUploadingImage(true);
        try {
            const response = await fetch(`${API_BASE}/Community/upload-media`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${activeToken}`
                },
                body
            });
            const data = await safeReadJson(response);
            if (!response.ok) throw new Error(data.message || 'Tải ảnh danh mục thất bại.');
            setForm((current)=>({
                    ...current,
                    imageUrl: data.mediaUrl
                }));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã tải ảnh danh mục lên.');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        } finally{
            setUploadingImage(false);
            event.target.value = '';
        }
    };
    const handleLogout = async ()=>{
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (refreshToken) {
                await fetch(`${API_V1}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        refreshToken
                    })
                });
            }
        } catch  {
        // The local session is always cleared; the backend may be unavailable.
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đăng xuất thành công.');
        navigate('/login');
    };
    const selectedCategory = categories.find((category)=>category.id === selectedCategoryId);
    const selectedCategoryRecipes = selectedCategory ? recipes.filter((recipe)=>recipe.categoryId === selectedCategoryId).sort((first, second)=>first.title.localeCompare(second.title, 'vi')) : [];
    const selectCategory = (categoryId)=>{
        setSelectedCategoryId(categoryId);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommunityNav"], {}, void 0, false, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 718,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "content-shell categories-page",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "page-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "eyebrow",
                                        children: "Culinary Blog"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 721,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        children: t(token ? 'Quản lý Danh mục' : 'Khám phá Danh mục')
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 722,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 720,
                                columnNumber: 9
                            }, this),
                            token ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "logout-btn",
                                onClick: handleLogout,
                                children: t('Đăng xuất')
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 724,
                                columnNumber: 18
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "logout-btn",
                                onClick: ()=>navigate('/login'),
                                children: t('Đăng nhập')
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 724,
                                columnNumber: 114
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 719,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "category-catalog",
                        "aria-label": "Danh mục món ăn",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "category-catalog-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "eyebrow",
                                                children: "BẾP NHÀ · PHÂN LOẠI"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 729,
                                                columnNumber: 16
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Chọn một khẩu vị"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 729,
                                                columnNumber: 62
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Chọn danh mục để xem các công thức cùng nhóm."
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 729,
                                                columnNumber: 87
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 729,
                                        columnNumber: 11
                                    }, this),
                                    token && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "secondary-btn compact-btn",
                                        onClick: ()=>{
                                            resetForm();
                                            setIsFormOpen(true);
                                        },
                                        children: "+ Thêm danh mục"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 730,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 728,
                                columnNumber: 9
                            }, this),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "empty-state",
                                children: "Đang tải danh mục..."
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 732,
                                columnNumber: 20
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "category-card-grid",
                                children: categories.map((category, index)=>{
                                    const recipeCount = recipes.filter((recipe)=>recipe.categoryId === category.id).length;
                                    const selected = selectedCategoryId === category.id;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        className: `category-tile${selected ? ' is-selected' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "category-tile-select",
                                                onClick: ()=>selectCategory(category.id),
                                                "aria-pressed": selected,
                                                "aria-controls": "category-recipes-panel",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "category-tile-image",
                                                        children: category.imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: category.imageUrl,
                                                            alt: category.name,
                                                            loading: "lazy"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 738,
                                                            columnNumber: 75
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Ảnh danh mục chưa thêm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 738,
                                                            columnNumber: 144
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 738,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "category-tile-content",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "category-tile-index",
                                                                children: String(index + 1).padStart(2, '0')
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 739,
                                                                columnNumber: 56
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "category-tile-tag",
                                                                children: [
                                                                    "# ",
                                                                    t(category.name)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 739,
                                                                columnNumber: 137
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                children: t(category.name)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 739,
                                                                columnNumber: 200
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: t(category.description || 'Khám phá công thức trong danh mục này.')
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 739,
                                                                columnNumber: 227
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                children: [
                                                                    recipeCount,
                                                                    " công thức ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        "aria-hidden": "true",
                                                                        children: "↓"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 739,
                                                                        columnNumber: 334
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 739,
                                                                columnNumber: 303
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 739,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 737,
                                                columnNumber: 15
                                            }, this),
                                            token && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "category-edit-icon",
                                                onClick: ()=>handleEdit(category),
                                                "aria-label": `Chỉnh sửa ${category.name}`,
                                                title: "Chỉnh sửa danh mục",
                                                children: "✎"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 741,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, category.id, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 736,
                                        columnNumber: 20
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 732,
                                columnNumber: 78
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 727,
                        columnNumber: 7
                    }, this),
                    selectedCategory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "category-recipes-backdrop",
                        onMouseDown: (event)=>{
                            if (event.target === event.currentTarget) setSelectedCategoryId(null);
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "category-recipes-dialog",
                            id: "category-recipes-panel",
                            role: "dialog",
                            "aria-modal": "true",
                            "aria-labelledby": "category-recipes-title",
                            "aria-live": "polite",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                    className: "category-recipes-dialog-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "eyebrow",
                                                    children: [
                                                        "# ",
                                                        t(selectedCategory.name)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 749,
                                                    columnNumber: 67
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    id: "category-recipes-title",
                                                    children: [
                                                        "Các món trong danh mục ",
                                                        t(selectedCategory.name)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 749,
                                                    columnNumber: 122
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        selectedCategoryRecipes.length,
                                                        " công thức"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 749,
                                                    columnNumber: 208
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 749,
                                            columnNumber: 62
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "recipe-modal-close",
                                            onClick: ()=>setSelectedCategoryId(null),
                                            "aria-label": "Đóng danh sách công thức",
                                            children: "×"
                                        }, void 0, false, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 749,
                                            columnNumber: 269
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 749,
                                    columnNumber: 11
                                }, this),
                                selectedCategoryRecipes.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "category-recipe-list",
                                    children: selectedCategoryRecipes.map((recipe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                            to: `/recipes/${recipe.id}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: t(recipe.title)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 750,
                                                    columnNumber: 173
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: [
                                                        recipe.cookingTimeMinutes ? `${recipe.cookingTimeMinutes} phút` : 'Mở công thức',
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            "aria-hidden": "true",
                                                            children: "→"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 750,
                                                            columnNumber: 293
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 750,
                                                    columnNumber: 203
                                                }, this)
                                            ]
                                        }, recipe.id, true, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 750,
                                            columnNumber: 122
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 750,
                                    columnNumber: 45
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "empty-state",
                                    children: "Chưa có công thức trong danh mục này."
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 750,
                                    columnNumber: 346
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "category-dialog-dismiss",
                                        onClick: ()=>setSelectedCategoryId(null),
                                        children: "Đã hiểu, đóng danh sách"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 751,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 751,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 748,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 747,
                        columnNumber: 28
                    }, this),
                    token && isFormOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "recipe-modal-backdrop",
                        onMouseDown: (event)=>{
                            if (event.target === event.currentTarget) resetForm();
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "category-form-card category-modal",
                            role: "dialog",
                            "aria-modal": "true",
                            "aria-labelledby": "category-form-title",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                    className: "recipe-modal-heading",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "eyebrow",
                                                    children: "CULINARY BLOG"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 757,
                                                    columnNumber: 57
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    id: "category-form-title",
                                                    children: editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 757,
                                                    columnNumber: 97
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 757,
                                            columnNumber: 52
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "recipe-modal-close",
                                            onClick: resetForm,
                                            "aria-label": "Đóng",
                                            children: "×"
                                        }, void 0, false, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 757,
                                            columnNumber: 193
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 757,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleSubmit,
                                    className: "category-form",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "category-name",
                                                    children: "Tên danh mục"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 759,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "category-name",
                                                    value: form.name,
                                                    onChange: (event)=>setForm({
                                                            ...form,
                                                            name: event.target.value
                                                        }),
                                                    required: true,
                                                    maxLength: 100
                                                }, void 0, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 759,
                                                    columnNumber: 92
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 759,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "category-description",
                                                    children: "Mô tả / phân loại"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 760,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    id: "category-description",
                                                    rows: "3",
                                                    value: form.description,
                                                    onChange: (event)=>setForm({
                                                            ...form,
                                                            description: event.target.value
                                                        }),
                                                    maxLength: 500
                                                }, void 0, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 760,
                                                    columnNumber: 104
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 760,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "category-image",
                                                    children: "Ảnh danh mục"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 761,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "recipe-image-upload",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "category-image",
                                                            type: "file",
                                                            accept: "image/jpeg,image/png,image/webp",
                                                            onChange: handleImageUpload,
                                                            disabled: uploadingImage
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 761,
                                                            columnNumber: 130
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: uploadingImage ? 'Đang tải ảnh...' : 'JPG, PNG hoặc WebP · tối đa 5 MB'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 761,
                                                            columnNumber: 267
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 761,
                                                    columnNumber: 93
                                                }, this),
                                                form.imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "recipe-image-preview",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: form.imageUrl,
                                                            alt: "Xem trước ảnh danh mục"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 761,
                                                            columnNumber: 416
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setForm({
                                                                    ...form,
                                                                    imageUrl: ''
                                                                }),
                                                            children: "Gỡ ảnh"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 761,
                                                            columnNumber: 472
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 761,
                                                    columnNumber: 378
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "recipe-image-placeholder",
                                                    children: "Ảnh danh mục sẽ hiển thị tại đây"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 761,
                                                    columnNumber: 569
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 761,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-actions",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    className: "primary-btn compact-btn",
                                                    disabled: uploadingImage,
                                                    children: editingId ? 'Lưu thay đổi' : 'Thêm danh mục'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 762,
                                                    columnNumber: 43
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    className: "secondary-btn compact-btn",
                                                    onClick: resetForm,
                                                    children: "Hủy"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 762,
                                                    columnNumber: 182
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 762,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 758,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 756,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 755,
                        columnNumber: 31
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 718,
                columnNumber: 23
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/App.jsx",
        lineNumber: 718,
        columnNumber: 5
    }, this);
}
_s3(CategoriesPage, "SOtdvzRSdHvib5Bp1r5CjPdEFXs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c4 = CategoriesPage;
function RecipesPage() {
    _s4();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const [recipes, setRecipes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [categoryFilter, setCategoryFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFormOpen, setIsFormOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadingImage, setUploadingImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        description: '',
        imageUrl: '',
        categoryId: '',
        ingredients: '',
        instructions: '',
        prepTimeMinutes: 1,
        cookTimeMinutes: 0,
        servings: 2,
        difficulty: 'Medium',
        isVegetarian: false,
        nutrition: {
            calories: '',
            protein: '',
            carbohydrates: '',
            fat: '',
            fiber: '',
            sodium: ''
        }
    });
    const [maxMinutesFilter, setMaxMinutesFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [difficultyFilter, setDifficultyFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [vegetarianFilter, setVegetarianFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [ingredientSearch, setIngredientSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const token = getStoredToken();
    const resetForm = ()=>{
        setForm({
            title: '',
            description: '',
            imageUrl: '',
            categoryId: categories[0]?.id || '',
            ingredients: '',
            instructions: '',
            prepTimeMinutes: 1,
            cookTimeMinutes: 0,
            servings: 2,
            difficulty: 'Medium',
            isVegetarian: false,
            nutrition: {
                calories: '',
                protein: '',
                carbohydrates: '',
                fat: '',
                fiber: '',
                sodium: ''
            }
        });
        setEditingId(null);
        setIsFormOpen(false);
    };
    const fetchCategories = async ()=>{
        const response = await fetch(`${API_V1}/categories`, {});
        if (!response.ok) {
            throw new Error('Không thể tải danh mục để gắn cho công thức.');
        }
        const data = await readApiResponse(response);
        setCategories(data);
        if (!form.categoryId && data[0]) {
            setForm((current)=>({
                    ...current,
                    categoryId: data[0].id
                }));
        }
    };
    const fetchRecipes = async ()=>{
        const activeToken = await getFreshAccessToken();
        const response = await fetch(`${API_V1}/recipes${activeToken ? '/mine' : ''}`, {
            headers: activeToken ? {
                Authorization: `Bearer ${activeToken}`
            } : {}
        });
        if (!response.ok) {
            throw new Error('Không thể tải danh sách công thức.');
        }
        const data = await readApiResponse(response);
        setRecipes(data);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RecipesPage.useEffect": ()=>{
            const loadData = {
                "RecipesPage.useEffect.loadData": async ()=>{
                    try {
                        await Promise.all([
                            fetchCategories(),
                            fetchRecipes()
                        ]);
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
                    } finally{
                        setLoading(false);
                    }
                }
            }["RecipesPage.useEffect.loadData"];
            loadData();
        }
    }["RecipesPage.useEffect"], []);
    const handleSubmit = async (event)=>{
        event.preventDefault();
        const activeToken = await getFreshAccessToken();
        if (!activeToken) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Phiên đã hết hạn. Vui lòng đăng nhập lại để lưu công thức.');
            navigate('/login');
            return;
        }
        if (!form.title.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Tiêu đề công thức không được để trống.');
            return;
        }
        if (!form.categoryId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn danh mục cho công thức.');
            return;
        }
        if (!form.ingredients.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng nhập ít nhất một nguyên liệu.');
            return;
        }
        if (!form.instructions.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng nhập các bước làm.');
            return;
        }
        const ingredientValues = form.ingredients.split(/\n|,/).map((item)=>item.trim()).filter(Boolean);
        const stepValues = form.instructions.split(/\n|\./).map((item)=>item.trim()).filter(Boolean);
        const nutritionValues = Object.fromEntries(Object.entries(form.nutrition).map(([key, value])=>[
                key,
                value === '' ? null : Number(value)
            ]));
        const hasNutrition = Object.values(form.nutrition).some((value)=>value !== '');
        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            imageUrl: form.imageUrl || null,
            ingredients: ingredientValues,
            instructions: stepValues,
            recipeIngredients: ingredientValues.map((name, index)=>({
                    name,
                    orderIndex: index + 1
                })),
            recipeSteps: stepValues.map((description)=>({
                    title: null,
                    description
                })),
            categoryId: form.categoryId,
            prepTimeMinutes: Number(form.prepTimeMinutes),
            cookTimeMinutes: Number(form.cookTimeMinutes),
            servings: Number(form.servings),
            difficulty: form.difficulty,
            isVegetarian: form.isVegetarian,
            nutrition: hasNutrition ? nutritionValues : null
        };
        try {
            const response = await fetch(`${API_V1}/recipes${editingId ? `/${editingId}` : ''}`, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${activeToken}`
                },
                body: JSON.stringify(payload)
            });
            const data = await safeReadJson(response);
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }
            if (!response.ok) {
                throw new Error(data.message || 'Lưu công thức thất bại.');
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(editingId ? 'Cập nhật công thức thành công.' : 'Thêm công thức thành công.');
            resetForm();
            await fetchRecipes();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const handleEdit = (recipe)=>{
        setEditingId(recipe.id);
        setForm({
            title: recipe.title,
            description: recipe.description || '',
            imageUrl: recipe.imageUrl || '',
            categoryId: recipe.categoryId,
            ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : '',
            instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : '',
            prepTimeMinutes: recipe.prepTimeMinutes ?? 1,
            cookTimeMinutes: recipe.cookTimeMinutes ?? 0,
            servings: recipe.servings ?? 1,
            difficulty: recipe.difficulty || 'Medium',
            isVegetarian: recipe.isVegetarian ?? false,
            nutrition: {
                calories: recipe.nutrition?.calories ?? '',
                protein: recipe.nutrition?.protein ?? '',
                carbohydrates: recipe.nutrition?.carbohydrates ?? '',
                fat: recipe.nutrition?.fat ?? '',
                fiber: recipe.nutrition?.fiber ?? '',
                sodium: recipe.nutrition?.sodium ?? ''
            }
        });
        setIsFormOpen(true);
    };
    const handleImageUpload = async (event)=>{
        const file = event.target.files?.[0];
        if (!file) return;
        if (![
            'image/jpeg',
            'image/png',
            'image/webp'
        ].includes(file.type)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.');
            event.target.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Ảnh món ăn tối đa 5 MB.');
            event.target.value = '';
            return;
        }
        const activeToken = await getFreshAccessToken();
        if (!activeToken) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Phiên đã hết hạn. Vui lòng đăng nhập lại để tải ảnh.');
            navigate('/login');
            return;
        }
        const body = new FormData();
        body.append('file', file);
        setUploadingImage(true);
        try {
            const response = await fetch(`${API_BASE}/Community/upload-media`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${activeToken}`
                },
                body
            });
            const data = await safeReadJson(response);
            if (!response.ok) throw new Error(data.message || 'Tải ảnh lên thất bại.');
            setForm((current)=>({
                    ...current,
                    imageUrl: data.mediaUrl
                }));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã tải ảnh món ăn lên.');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        } finally{
            setUploadingImage(false);
            event.target.value = '';
        }
    };
    const openCreateForm = ()=>{
        resetForm();
        setIsFormOpen(true);
    };
    const handleDelete = async (id)=>{
        if (!window.confirm('Bạn có chắc muốn xóa công thức này?')) {
            return;
        }
        try {
            const response = await fetch(`${API_V1}/recipes/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await safeReadJson(response);
            if (!response.ok) {
                throw new Error(data.message || 'Xóa công thức thất bại.');
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(data.message || 'Xóa công thức thành công.');
            setRecipes((current)=>current.filter((recipe)=>recipe.id !== id));
            if (editingId === id) resetForm();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const handleTransition = async (id, transition)=>{
        const activeToken = await getFreshAccessToken();
        if (!activeToken) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            return;
        }
        try {
            const response = await fetch(`${API_V1}/recipes/${id}/${transition}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${activeToken}`
                }
            });
            const data = await safeReadJson(response);
            if (!response.ok) throw new Error(data.message || 'Không thể đổi trạng thái công thức.');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã cập nhật trạng thái công thức.');
            await fetchRecipes();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const handleLogout = ()=>{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đăng xuất thành công.');
        navigate('/login');
    };
    const filteredRecipes = recipes.filter((recipe)=>{
        const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) || t(recipe.title).toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || recipe.categoryId === categoryFilter;
        const matchesStatus = statusFilter === 'all' || String(recipe.status) === statusFilter;
        const matchesTime = !maxMinutesFilter || recipe.cookingTimeMinutes && recipe.cookingTimeMinutes <= Number(maxMinutesFilter);
        const matchesDifficulty = difficultyFilter === 'all' || recipe.difficulty === difficultyFilter;
        const matchesDiet = vegetarianFilter === 'all' || String(recipe.isVegetarian) === vegetarianFilter;
        const matchesIngredient = !ingredientSearch || (recipe.ingredients || []).some((item)=>item.toLowerCase().includes(ingredientSearch.toLowerCase()) || t(item).toLowerCase().includes(ingredientSearch.toLowerCase()));
        return matchesSearch && matchesCategory && matchesStatus && matchesTime && matchesDifficulty && matchesDiet && matchesIngredient;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommunityNav"], {}, void 0, false, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 1086,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "content-shell recipes-page",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "page-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "eyebrow",
                                        children: t('Culinary Blog')
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 1089,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        children: t(token ? 'Quản lý Công thức' : 'Khám phá Công thức')
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 1090,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1088,
                                columnNumber: 9
                            }, this),
                            token ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "logout-btn",
                                onClick: handleLogout,
                                children: t('Đăng xuất')
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1093,
                                columnNumber: 11
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "logout-btn",
                                onClick: ()=>navigate('/login'),
                                children: t('Đăng nhập')
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1095,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1087,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "recipe-layout",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "table-panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "recipes-toolbar",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "summary-chip",
                                                children: [
                                                    filteredRecipes.length,
                                                    " ",
                                                    t('món ăn')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1102,
                                                columnNumber: 13
                                            }, this),
                                            token && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "secondary-btn compact-btn",
                                                onClick: openCreateForm,
                                                children: [
                                                    "+ ",
                                                    t('Thêm mới')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1103,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 1101,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "filter-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: t('Tìm kiếm theo tên công thức'),
                                                value: search,
                                                onChange: (event)=>setSearch(event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1107,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: categoryFilter,
                                                onChange: (event)=>setCategoryFilter(event.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "all",
                                                        children: t('Tất cả danh mục')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1114,
                                                        columnNumber: 15
                                                    }, this),
                                                    categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: category.id,
                                                            children: t(category.name)
                                                        }, category.id, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1116,
                                                            columnNumber: 17
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1113,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: statusFilter,
                                                onChange: (event)=>setStatusFilter(event.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "all",
                                                        children: t('Tất cả trạng thái')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1120,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "1",
                                                        children: t('Published')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1121,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "0",
                                                        children: t('Draft')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1122,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "2",
                                                        children: t('Archived')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1123,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1119,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: "1",
                                                placeholder: t('Tối đa (phút)'),
                                                value: maxMinutesFilter,
                                                onChange: (event)=>setMaxMinutesFilter(event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1125,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: difficultyFilter,
                                                onChange: (event)=>setDifficultyFilter(event.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "all",
                                                        children: t('Mọi độ khó')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1127,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Easy",
                                                        children: t('Easy')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1128,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Medium",
                                                        children: t('Medium')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1129,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Hard",
                                                        children: t('Hard')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1130,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Expert",
                                                        children: t('Expert')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1131,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1126,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: vegetarianFilter,
                                                onChange: (event)=>setVegetarianFilter(event.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "all",
                                                        children: t('Mọi chế độ ăn')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1134,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "true",
                                                        children: t('Món chay')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1135,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "false",
                                                        children: t('Có thịt/cá')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1136,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1133,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "search",
                                                placeholder: t('Nguyên liệu có chứa...'),
                                                value: ingredientSearch,
                                                onChange: (event)=>setIngredientSearch(event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1138,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 1106,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "recipe-card-list",
                                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "empty-state",
                                            children: t('Đang tải công thức...')
                                        }, void 0, false, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 1142,
                                            columnNumber: 24
                                        }, this) : filteredRecipes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "empty-state",
                                            children: t('Không tìm thấy công thức nào.')
                                        }, void 0, false, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 1142,
                                            columnNumber: 121
                                        }, this) : filteredRecipes.map((recipe, index)=>{
                                            const categoryName = t(categories.find((category)=>category.id === recipe.categoryId)?.name || 'Chưa có');
                                            const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
                                            const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                                className: "recipe-summary-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "recipe-card-index",
                                                        "aria-label": `Số thứ tự ${index + 1}`,
                                                        children: String(index + 1).padStart(2, '0')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1147,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                        to: `/recipes/${recipe.id}`,
                                                        className: "recipe-card-photo",
                                                        "aria-label": `Xem ${t(recipe.title)}`,
                                                        children: [
                                                            recipe.imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: recipe.imageUrl,
                                                                alt: t(recipe.title),
                                                                loading: "lazy"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 1149,
                                                                columnNumber: 38
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "recipe-no-photo",
                                                                children: "Chưa có ảnh"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 1149,
                                                                columnNumber: 107
                                                            }, this),
                                                            recipe.cookingTimeMinutes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "◷ ",
                                                                    recipe.cookingTimeMinutes,
                                                                    " phút"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 1150,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1148,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "recipe-card-content",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "recipe-card-heading",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "recipe-category-tag",
                                                                                children: [
                                                                                    "# ",
                                                                                    categoryName
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/App.jsx",
                                                                                lineNumber: 1155,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                                    to: `/recipes/${recipe.id}`,
                                                                                    children: t(recipe.title)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/App.jsx",
                                                                                    lineNumber: 1156,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/App.jsx",
                                                                                lineNumber: 1156,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: t(recipe.description || 'Một công thức ngon đang chờ bạn khám phá.')
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/App.jsx",
                                                                                lineNumber: 1157,
                                                                                columnNumber: 23
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1154,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    token && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        className: "recipe-edit-icon",
                                                                        onClick: ()=>handleEdit(recipe),
                                                                        "aria-label": `Chỉnh sửa ${t(recipe.title)}`,
                                                                        title: "Chỉnh sửa công thức",
                                                                        children: "✎"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1159,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 1153,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "recipe-card-meta",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "◷ ",
                                                                            recipe.cookingTimeMinutes ? `${recipe.cookingTimeMinutes} phút` : 'Chưa cập nhật thời gian'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1162,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: t(recipe.difficulty || 'Trung bình')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1163,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    recipe.isVegetarian && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Món chay"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1164,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    token && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `recipe-status-${recipe.status === 1 ? 'published' : recipe.status === 2 ? 'archived' : 'draft'}`,
                                                                        children: recipe.status === 1 ? 'Published' : recipe.status === 2 ? 'Archived' : 'Draft'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1165,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 1161,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "recipe-card-details",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                children: "Nguyên liệu"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/App.jsx",
                                                                                lineNumber: 1168,
                                                                                columnNumber: 26
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: [
                                                                                    ingredients.slice(0, 4).map(t).join(' · '),
                                                                                    ingredients.length > 4 ? ` · +${ingredients.length - 4} nguyên liệu` : ''
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/App.jsx",
                                                                                lineNumber: 1168,
                                                                                columnNumber: 46
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1168,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                children: "Các bước làm"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/App.jsx",
                                                                                lineNumber: 1169,
                                                                                columnNumber: 26
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: [
                                                                                    instructions.slice(0, 2).map(t).join(' · '),
                                                                                    instructions.length > 2 ? ` · +${instructions.length - 2} bước` : ''
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/App.jsx",
                                                                                lineNumber: 1169,
                                                                                columnNumber: 47
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1169,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 1167,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "recipe-card-actions",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                        to: `/recipes/${recipe.id}`,
                                                                        children: [
                                                                            "Xem công thức ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                "aria-hidden": "true",
                                                                                children: "→"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/App.jsx",
                                                                                lineNumber: 1172,
                                                                                columnNumber: 70
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1172,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    token && recipe.status === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleTransition(recipe.id, 'publish'),
                                                                        children: "Publish"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1173,
                                                                        columnNumber: 54
                                                                    }, this),
                                                                    token && recipe.status === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleTransition(recipe.id, 'unpublish'),
                                                                        children: "Unpublish"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1174,
                                                                        columnNumber: 54
                                                                    }, this),
                                                                    token && recipe.status !== 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleTransition(recipe.id, 'archive'),
                                                                        children: "Archive"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1175,
                                                                        columnNumber: 54
                                                                    }, this),
                                                                    token && recipe.status === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleTransition(recipe.id, 'restore'),
                                                                        children: "Restore"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1176,
                                                                        columnNumber: 54
                                                                    }, this),
                                                                    token && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleDelete(recipe.id),
                                                                        "aria-label": `Xóa ${t(recipe.title)}`,
                                                                        children: "Xóa"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1177,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 1171,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/App.jsx",
                                                        lineNumber: 1152,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, recipe.id, true, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1146,
                                                columnNumber: 22
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 1141,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1100,
                                columnNumber: 9
                            }, this),
                            token && isFormOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "recipe-modal-backdrop",
                                onMouseDown: (event)=>{
                                    if (event.target === event.currentTarget) resetForm();
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    className: "recipe-form-card recipe-modal",
                                    role: "dialog",
                                    "aria-modal": "true",
                                    "aria-labelledby": "recipe-form-title",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                            className: "recipe-modal-heading",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "eyebrow",
                                                            children: "CULINARY BLOG"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1188,
                                                            columnNumber: 20
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            id: "recipe-form-title",
                                                            children: editingId ? 'Chỉnh sửa công thức' : 'Thêm công thức mới'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1188,
                                                            columnNumber: 60
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 1188,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    className: "recipe-modal-close",
                                                    onClick: resetForm,
                                                    "aria-label": "Đóng",
                                                    children: "×"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 1189,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 1187,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                            onSubmit: handleSubmit,
                                            className: "recipe-form",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "recipe-title",
                                                            children: "Tiêu đề"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1193,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "recipe-title",
                                                            type: "text",
                                                            value: form.title,
                                                            onChange: (event)=>setForm({
                                                                    ...form,
                                                                    title: event.target.value
                                                                }),
                                                            placeholder: "Ví dụ: Bún chả"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1194,
                                                            columnNumber: 15
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 1192,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "recipe-description",
                                                            children: "Mô tả"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1204,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            id: "recipe-description",
                                                            rows: "3",
                                                            value: form.description,
                                                            onChange: (event)=>setForm({
                                                                    ...form,
                                                                    description: event.target.value
                                                                }),
                                                            placeholder: "Mô tả ngắn về công thức"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1205,
                                                            columnNumber: 15
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 1203,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "recipe-image",
                                                            children: "Ảnh món ăn"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1215,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "recipe-image-upload",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    id: "recipe-image",
                                                                    type: "file",
                                                                    accept: "image/jpeg,image/png,image/webp",
                                                                    onChange: handleImageUpload,
                                                                    disabled: uploadingImage
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/App.jsx",
                                                                    lineNumber: 1217,
                                                                    columnNumber: 17
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                    children: uploadingImage ? 'Đang tải ảnh...' : 'JPG, PNG hoặc WebP · tối đa 5 MB'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/App.jsx",
                                                                    lineNumber: 1218,
                                                                    columnNumber: 17
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1216,
                                                            columnNumber: 15
                                                        }, this),
                                                        form.imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "recipe-image-preview",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: form.imageUrl,
                                                                    alt: "Xem trước món ăn"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/App.jsx",
                                                                    lineNumber: 1220,
                                                                    columnNumber: 70
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>setForm({
                                                                            ...form,
                                                                            imageUrl: ''
                                                                        }),
                                                                    children: "Gỡ ảnh"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/App.jsx",
                                                                    lineNumber: 1220,
                                                                    columnNumber: 120
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1220,
                                                            columnNumber: 32
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "recipe-image-placeholder",
                                                            children: "Ảnh món ăn sẽ hiển thị tại đây"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1220,
                                                            columnNumber: 217
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 1214,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "recipe-category",
                                                            children: "Thuộc danh mục"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1224,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            id: "recipe-category",
                                                            value: form.categoryId,
                                                            onChange: (event)=>setForm({
                                                                    ...form,
                                                                    categoryId: event.target.value
                                                                }),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "",
                                                                    children: "-- Chọn danh mục --"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/App.jsx",
                                                                    lineNumber: 1230,
                                                                    columnNumber: 17
                                                                }, this),
                                                                categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: category.id,
                                                                        children: category.name
                                                                    }, category.id, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1232,
                                                                        columnNumber: 19
                                                                    }, this))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1225,
                                                            columnNumber: 15
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 1223,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group recipe-meta-fields",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "recipe-prep-time",
                                                            children: "Prep time (phút)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1240,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "recipe-prep-time",
                                                            type: "number",
                                                            min: "1",
                                                            max: "1440",
                                                            required: true,
                                                            value: form.prepTimeMinutes,
                                                            onChange: (event)=>setForm({
                                                                    ...form,
                                                                    prepTimeMinutes: event.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1241,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "recipe-cook-time",
                                                            children: "Cook time (phút)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1242,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "recipe-cook-time",
                                                            type: "number",
                                                            min: "0",
                                                            max: "1440",
                                                            required: true,
                                                            value: form.cookTimeMinutes,
                                                            onChange: (event)=>setForm({
                                                                    ...form,
                                                                    cookTimeMinutes: event.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1243,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "recipe-servings",
                                                            children: "Servings"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1244,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "recipe-servings",
                                                            type: "number",
                                                            min: "1",
                                                            max: "100",
                                                            required: true,
                                                            value: form.servings,
                                                            onChange: (event)=>setForm({
                                                                    ...form,
                                                                    servings: event.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1245,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "recipe-difficulty",
                                                            children: "Độ khó"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1246,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            id: "recipe-difficulty",
                                                            value: form.difficulty,
                                                            onChange: (event)=>setForm({
                                                                    ...form,
                                                                    difficulty: event.target.value
                                                                }),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Easy",
                                                                    children: "Easy"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/App.jsx",
                                                                    lineNumber: 1248,
                                                                    columnNumber: 17
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Medium",
                                                                    children: "Medium"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/App.jsx",
                                                                    lineNumber: 1248,
                                                                    columnNumber: 51
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Hard",
                                                                    children: "Hard"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/App.jsx",
                                                                    lineNumber: 1248,
                                                                    columnNumber: 89
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Expert",
                                                                    children: "Expert"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/App.jsx",
                                                                    lineNumber: 1248,
                                                                    columnNumber: 123
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1247,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "recipe-vegetarian-toggle",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "checkbox",
                                                                    checked: form.isVegetarian,
                                                                    onChange: (event)=>setForm({
                                                                            ...form,
                                                                            isVegetarian: event.target.checked
                                                                        })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/App.jsx",
                                                                    lineNumber: 1250,
                                                                    columnNumber: 59
                                                                }, this),
                                                                " Món chay"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1250,
                                                            columnNumber: 15
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 1239,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                                                    className: "form-group recipe-meta-fields",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                                            children: "Nutrition (kcal / g / mg mỗi khẩu phần)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1254,
                                                            columnNumber: 15
                                                        }, this),
                                                        Object.entries({
                                                            calories: 'Calories (kcal)',
                                                            protein: 'Protein (g)',
                                                            carbohydrates: 'Carbohydrates (g)',
                                                            fat: 'Fat (g)',
                                                            fiber: 'Fiber (g)',
                                                            sodium: 'Sodium (mg)'
                                                        }).map(([key, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                htmlFor: `nutrition-${key}`,
                                                                children: [
                                                                    label,
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        id: `nutrition-${key}`,
                                                                        type: "number",
                                                                        min: "0",
                                                                        step: "0.01",
                                                                        value: form.nutrition[key],
                                                                        onChange: (event)=>setForm((current)=>({
                                                                                    ...current,
                                                                                    nutrition: {
                                                                                        ...current.nutrition,
                                                                                        [key]: event.target.value
                                                                                    }
                                                                                }))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/App.jsx",
                                                                        lineNumber: 1256,
                                                                        columnNumber: 70
                                                                    }, this)
                                                                ]
                                                            }, key, true, {
                                                                fileName: "[project]/src/App.jsx",
                                                                lineNumber: 1256,
                                                                columnNumber: 17
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 1253,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "recipe-ingredients",
                                                            children: "Nguyên liệu"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1261,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            id: "recipe-ingredients",
                                                            rows: "5",
                                                            value: form.ingredients,
                                                            onChange: (event)=>setForm({
                                                                    ...form,
                                                                    ingredients: event.target.value
                                                                }),
                                                            placeholder: "Mỗi nguyên liệu trên 1 dòng hoặc cách nhau bằng dấu phẩy"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1262,
                                                            columnNumber: 15
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 1260,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "recipe-instructions",
                                                            children: "Các bước làm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1272,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            id: "recipe-instructions",
                                                            rows: "5",
                                                            value: form.instructions,
                                                            onChange: (event)=>setForm({
                                                                    ...form,
                                                                    instructions: event.target.value
                                                                }),
                                                            placeholder: "Mỗi bước trên 1 dòng"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1273,
                                                            columnNumber: 15
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 1271,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-actions",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "submit",
                                                            className: "primary-btn compact-btn",
                                                            children: editingId ? 'Lưu thay đổi' : 'Thêm mới'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1283,
                                                            columnNumber: 15
                                                        }, this),
                                                        editingId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            className: "secondary-btn compact-btn",
                                                            onClick: resetForm,
                                                            children: "Hủy"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/App.jsx",
                                                            lineNumber: 1287,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 1282,
                                                    columnNumber: 13
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 1191,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/App.jsx",
                                    lineNumber: 1186,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1185,
                                columnNumber: 33
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1099,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 1086,
                columnNumber: 23
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/App.jsx",
        lineNumber: 1086,
        columnNumber: 5
    }, this);
}
_s4(RecipesPage, "HNKWjNL5aEl5OoOmAzTxammhhMI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c5 = RecipesPage;
function App() {
    _s5();
    const location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"])();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Navigate"], {
                            to: "/community",
                            replace: true
                        }, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1307,
                            columnNumber: 34
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1307,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/login",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginPage, {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1308,
                            columnNumber: 39
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1308,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/register",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RegisterPage, {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1309,
                            columnNumber: 42
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1309,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/home",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Navigate"], {
                            to: "/community",
                            replace: true
                        }, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1310,
                            columnNumber: 38
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1310,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/community",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FeedPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1311,
                            columnNumber: 43
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1311,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/articles/:slug",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArticlePage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1312,
                            columnNumber: 48
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1312,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/members",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MembersPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1313,
                            columnNumber: 41
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1313,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/members/:username",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MemberProfilePage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1314,
                            columnNumber: 51
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1314,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/account",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccountPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1315,
                            columnNumber: 41
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1315,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/saved",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SavedRecipesPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1316,
                            columnNumber: 39
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1316,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/cook-mode",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CookModePage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1317,
                            columnNumber: 43
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1317,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/fridge",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FridgeMatchPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1318,
                            columnNumber: 40
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1318,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/flexible-recipe",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlexibleRecipePage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1319,
                            columnNumber: 49
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1319,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/journal",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RecipeJournalPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1320,
                            columnNumber: 41
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1320,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/qna",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RecipeQnaPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1321,
                            columnNumber: 37
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1321,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/cook-together",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CookTogetherPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1322,
                            columnNumber: 47
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1322,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/cookbook",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CookbookShelfPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1323,
                            columnNumber: 42
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1323,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/taste-suggestion",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TasteSuggestionPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1324,
                            columnNumber: 50
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1324,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/ai-chat",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AIAssistantPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1325,
                            columnNumber: 41
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1325,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/seasonal-challenge",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SeasonalChallengePage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1326,
                            columnNumber: 52
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1326,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/standard-recipe",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StandardRecipePage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1327,
                            columnNumber: 49
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1327,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/editor-picks",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditorPicksPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1328,
                            columnNumber: 46
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1328,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/author-profile",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthorProfilePage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1329,
                            columnNumber: 48
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1329,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/multilingual",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MultilingualPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1330,
                            columnNumber: 46
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1330,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/print-export",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PrintExportPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1331,
                            columnNumber: 46
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1331,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/planner",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MealPlannerPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1332,
                            columnNumber: 41
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1332,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/challenges",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChallengesPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1333,
                            columnNumber: 44
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1333,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/creator",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreatorDashboardPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1334,
                            columnNumber: 41
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1334,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/notifications",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotificationsPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1335,
                            columnNumber: 47
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1335,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/safety",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SafetyPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1336,
                            columnNumber: 40
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1336,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/drafts",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$PlatformFeaturePages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DraftsPage"], {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1337,
                            columnNumber: 40
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1337,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/categories",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CategoriesPage, {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1338,
                            columnNumber: 44
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1338,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/recipes",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RecipesPage, {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1339,
                            columnNumber: 41
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1339,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/recipes/new",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProtectedRoute, {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$routes$2f$wizard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1344,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1343,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1340,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
                        path: "/recipes/:id",
                        element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RecipeDetailPage, {}, void 0, false, {
                            fileName: "[project]/src/App.jsx",
                            lineNumber: 1348,
                            columnNumber: 45
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1348,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 1306,
                columnNumber: 7
            }, this),
            !isAuthPage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SiteFooter, {}, void 0, false, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 1350,
                columnNumber: 23
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/App.jsx",
        lineNumber: 1305,
        columnNumber: 5
    }, this);
}
_s5(App, "pkHmaVRPskBaU4tMJuJJpV42k1I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"]
    ];
});
_c6 = App;
function SiteFooter() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "site-footer",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "site-footer__main",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "site-footer__brand",
                        "aria-label": "Giới thiệu Culinary Blog",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                className: "site-footer__logo",
                                to: "/community",
                                "aria-label": "Culinary Blog - Trang cộng đồng",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "site-footer__logo-mark",
                                        children: "C"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 1361,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Culinary",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Blog"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1362,
                                                columnNumber: 27
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 1362,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1360,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Nơi lưu giữ công thức, chia sẻ câu chuyện và tìm cảm hứng cho những bữa ăn mỗi ngày."
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1364,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                className: "site-footer__write-link",
                                to: "/recipes/new",
                                children: [
                                    "Chia sẻ công thức ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        children: "→"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 1365,
                                        columnNumber: 89
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1365,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1359,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "site-footer__links",
                        "aria-label": "Khám phá",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Khám phá"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1369,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                to: "/community",
                                children: "Cộng đồng"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1370,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                to: "/recipes",
                                children: "Công thức món ăn"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1371,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                to: "/categories",
                                children: "Danh mục món ăn"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1372,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                to: "/challenges",
                                children: "Thử thách nấu ăn"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1373,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1368,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "site-footer__social",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Kết nối với chúng tôi"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1377,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Theo dõi Culinary Blog để cập nhật món ngon và hoạt động mới."
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1378,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "site-footer__social-list",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://www.facebook.com/dducthanh.1",
                                        target: "_blank",
                                        rel: "noreferrer",
                                        "aria-label": "Facebook Culinary Blog",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                "aria-hidden": "true",
                                                children: "f"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1381,
                                                columnNumber: 15
                                            }, this),
                                            " Facebook"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 1380,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://www.instagram.com/joxpiz_/",
                                        target: "_blank",
                                        rel: "noreferrer",
                                        "aria-label": "Instagram Culinary Blog",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                "aria-hidden": "true",
                                                children: "◎"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1384,
                                                columnNumber: 15
                                            }, this),
                                            " Instagram"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 1383,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://www.tiktok.com/@linhcutevcl1909",
                                        target: "_blank",
                                        rel: "noreferrer",
                                        "aria-label": "TikTok Culinary Blog",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                "aria-hidden": "true",
                                                children: "♪"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 1387,
                                                columnNumber: 15
                                            }, this),
                                            " TikTok"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 1386,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 1379,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1376,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 1358,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "site-footer__bottom",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "© ",
                            new Date().getFullYear(),
                            " Culinary Blog. Được làm bằng niềm yêu thích nấu ăn."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1393,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                        to: "/safety",
                        children: "An toàn cộng đồng"
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 1394,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 1392,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/App.jsx",
        lineNumber: 1357,
        columnNumber: 5
    }, this);
}
_c7 = SiteFooter;
const __TURBOPACK__default__export__ = App;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "ProtectedRoute");
__turbopack_context__.k.register(_c1, "LoginPage");
__turbopack_context__.k.register(_c2, "RegisterPage");
__turbopack_context__.k.register(_c3, "RecipeDetailPage");
__turbopack_context__.k.register(_c4, "CategoriesPage");
__turbopack_context__.k.register(_c5, "RecipesPage");
__turbopack_context__.k.register(_c6, "App");
__turbopack_context__.k.register(_c7, "SiteFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_App_jsx_0rbdrq-._.js.map