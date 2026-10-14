(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/CommunityPages.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountPage",
    ()=>AccountPage,
    "ArticlePage",
    ()=>ArticlePage,
    "CommunityNav",
    ()=>CommunityNav,
    "FeedPage",
    ()=>FeedPage,
    "MemberProfilePage",
    ()=>MemberProfilePage,
    "MembersPage",
    ()=>MembersPage,
    "NextArticlePage",
    ()=>NextArticlePage,
    "NextCommunityNav",
    ()=>NextCommunityNav,
    "NextMemberProfilePage",
    ()=>NextMemberProfilePage,
    "NextMembersPage",
    ()=>NextMembersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-router/dist/development/chunk-OB3PAWPO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/LocaleContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/config.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature(), _s12 = __turbopack_context__.k.signature(), _s13 = __turbopack_context__.k.signature(), _s14 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
const API_V1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVersionedApiBaseUrl"])();
const API = API_V1;
const EDITORIAL_STARTERS = [
    {
        id: 'starter-vietnamese-table',
        slug: 'mam-com-viet-giu-vi-quen-them-chut-moi',
        title: 'Mâm cơm Việt: giữ vị quen, thêm một chút mới',
        summary: 'Một mâm cơm ngon không cần cầu kỳ. Chỉ cần món chính vừa miệng, rau theo mùa và một chén nước chấm hợp vị.',
        coverImageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85',
        createdAt: '2026-09-27T08:00:00Z',
        author: {
            fullName: 'Ban biên tập Bếp Nhà',
            userName: 'bepnha'
        },
        content: `Có những bữa ăn khiến mình nhớ nhà chỉ bằng mùi hành phi và nồi canh còn nóng. Mâm cơm Việt thường bắt đầu từ những điều rất giản dị: một món mặn, một món rau, một món canh và chén nước chấm đặt giữa bàn.\n\nĐể bữa cơm quen không trở nên đơn điệu, hãy chọn nguyên liệu theo mùa rồi thay đổi cách nêm hoặc cách trình bày. Cá kho có thể ăn cùng rau luộc giòn; món xào nhiều màu sắc sẽ cân bằng một món kho đậm vị. Không cần thêm thật nhiều món, chỉ cần mỗi món có một vai trò rõ ràng.\n\nMột mẹo nhỏ là chuẩn bị phần sơ chế trước: rửa rau, ướp nguyên liệu và pha sẵn nước chấm. Khi đến giờ ăn, bạn chỉ cần nấu lần lượt những món cần dùng nóng. Cách làm này giúp bữa cơm tươm tất mà căn bếp vẫn nhẹ nhàng.\n\nCuối cùng, hãy nấu theo khẩu vị của người ngồi cùng bàn. Công thức là điểm khởi đầu; những điều chỉnh nhỏ của gia đình mới làm nên hương vị riêng của căn bếp nhà mình.`
    },
    {
        id: 'starter-food-photography',
        slug: 'anh-mon-an-dep-bat-dau-tu-anh-sang-cua-so',
        title: 'Ảnh món ăn đẹp bắt đầu từ ánh sáng bên cửa sổ',
        summary: 'Không cần studio hay thiết bị đắt tiền. Một góc bàn sáng, phông nền gọn và món ăn vừa nấu xong đã đủ để kể câu chuyện hấp dẫn.',
        coverImageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=85',
        createdAt: '2026-09-25T08:00:00Z',
        author: {
            fullName: 'Ban biên tập Bếp Nhà',
            userName: 'bepnha'
        },
        content: `Ánh sáng tự nhiên là người bạn dễ dùng nhất khi chụp món ăn tại nhà. Hãy đặt đĩa thức ăn gần cửa sổ, để ánh sáng chiếu từ bên cạnh hoặc hơi chếch phía sau. Ánh sáng xiên giúp bề mặt món ăn có chiều sâu và làm nổi bật kết cấu.\n\nTrước khi chụp, dọn bớt những vật không liên quan khỏi khung hình. Một chiếc khăn vải, đôi đũa hoặc nguyên liệu chính có thể làm đạo cụ; hãy để chúng hỗ trợ món ăn thay vì cạnh tranh sự chú ý.\n\nChụp thử từ trên xuống cho món có nhiều thành phần, hoặc hạ máy thấp ngang mặt bàn để nhấn vào lớp sốt và độ cao của món. Chạm lấy nét vào phần hấp dẫn nhất, sau đó giảm nhẹ độ sáng nếu vùng trắng bị mất chi tiết.\n\nĐiều quan trọng nhất vẫn là sự chân thật. Một bức ảnh không cần hoàn hảo; nó chỉ cần khiến người xem hình dung được hương vị và muốn thử nấu món đó.`
    },
    {
        id: 'starter-weeknight-cooking',
        slug: 'bua-toi-30-phut-chuan-bi-thong-minh-hon',
        title: 'Bữa tối 30 phút: chuẩn bị thông minh hơn, không nấu vội',
        summary: 'Lên thứ tự thao tác, tận dụng thời gian chờ và chọn nguyên liệu phù hợp để bữa tối ngày thường vẫn ngon lành.',
        coverImageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=85',
        createdAt: '2026-09-22T08:00:00Z',
        author: {
            fullName: 'Ban biên tập Bếp Nhà',
            userName: 'bepnha'
        },
        content: `Bữa tối nhanh không có nghĩa là phải làm mọi thứ cùng lúc. Trước tiên, chọn một món chính có thời gian nấu chủ động, chẳng hạn cá áp chảo, đậu phụ sốt hoặc mì xào. Ghép món đó với rau trộn hay canh đơn giản để không phải dùng quá nhiều nồi chảo.\n\nTrong lúc cơm hoặc nước sôi, bạn có thể rửa rau, cắt nguyên liệu và chuẩn bị gia vị. Sắp các nguyên liệu theo thứ tự cho vào chảo sẽ giúp thao tác liền mạch hơn. Nếu dùng thịt hoặc cá, hãy cắt thành phần vừa ăn để chín đều và nhanh.\n\nMột vài nguyên liệu dự trữ tốt như trứng, đậu phụ, rau củ đông lạnh và mì khô giúp bạn linh hoạt khi chưa kịp đi chợ. Hãy xem công thức như khung gợi ý, rồi thay bằng nguyên liệu đang có trong tủ lạnh.\n\nSau vài lần, bạn sẽ biết món nào hợp với nhịp sinh hoạt của gia đình. Ghi lại những kết hợp mình thích để lần sau việc chọn món cũng nhanh như lúc nấu.`
    }
];
const token = ()=>{
    const value = localStorage.getItem('accessToken') || '';
    if (!value) return '';
    try {
        const payload = JSON.parse(atob(value.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        if (!payload.exp || payload.exp * 1000 <= Date.now()) throw new Error('Token expired');
        return value;
    } catch  {
        localStorage.removeItem('accessToken');
        return '';
    }
};
const authHeaders = (json = false)=>({
        ...json ? {
            'Content-Type': 'application/json'
        } : {},
        ...token() ? {
            Authorization: `Bearer ${token()}`
        } : {}
    });
let refreshRequest;
async function refreshAccessToken() {
    if (!refreshRequest) {
        refreshRequest = fetch(`${API_V1}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken: localStorage.getItem('refreshToken') || ''
            })
        }).then(async (response)=>{
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readApiResponse"])(response);
            if (!response.ok || !data.accessToken || !data.refreshToken) throw new Error('Phiên đăng nhập đã hết hạn.');
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            return data.accessToken;
        }).catch((error)=>{
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            throw error;
        }).finally(()=>{
            refreshRequest = null;
        });
    }
    return refreshRequest;
}
async function apiRequest(path, options = {}) {
    const sendRequest = ()=>fetch(`${API}${path}`, {
            ...options,
            headers: {
                ...authHeaders(Boolean(options.body)),
                ...options.headers
            }
        });
    let response = await sendRequest();
    if (response.status === 401 && localStorage.getItem('refreshToken')) {
        try {
            await refreshAccessToken();
            response = await sendRequest();
        } catch  {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
    }
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readApiResponse"])(response);
    if (!response.ok) throw new Error(data.message || 'Không thể hoàn thành yêu cầu.');
    return data;
}
function Avatar({ user, size = 'normal' }) {
    const initials = (user?.fullName || user?.username || '?').slice(0, 1).toUpperCase();
    return user?.avatarUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        className: `community-avatar ${size}`,
        src: user.avatarUrl,
        alt: user.fullName || user.username
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 104,
        columnNumber: 7
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `community-avatar avatar-fallback ${size}`,
        children: initials
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 105,
        columnNumber: 7
    }, this);
}
_c = Avatar;
function CommunityNavContent({ navigate, pathname, useNextLinks = false }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const [me, setMe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [unreadCount, setUnreadCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommunityNavContent.useEffect": ()=>{
            const loadAccount = {
                "CommunityNavContent.useEffect.loadAccount": ()=>{
                    if (!token() && !localStorage.getItem('refreshToken')) return;
                    Promise.all([
                        apiRequest('/account/me'),
                        apiRequest('/features/notifications')
                    ]).then({
                        "CommunityNavContent.useEffect.loadAccount": ([user, notifications])=>{
                            setMe(user);
                            setUnreadCount(notifications.unreadCount);
                        }
                    }["CommunityNavContent.useEffect.loadAccount"]).catch({
                        "CommunityNavContent.useEffect.loadAccount": ()=>setMe(null)
                    }["CommunityNavContent.useEffect.loadAccount"]);
                }
            }["CommunityNavContent.useEffect.loadAccount"];
            loadAccount();
            window.addEventListener('auth-session-refreshed', loadAccount);
            return ({
                "CommunityNavContent.useEffect": ()=>window.removeEventListener('auth-session-refreshed', loadAccount)
            })["CommunityNavContent.useEffect"];
        }
    }["CommunityNavContent.useEffect"], []);
    const logout = async ()=>{
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (refreshToken) {
                await fetch(`${API_V1}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token()}`
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
        navigate('/community');
        window.location.reload();
    };
    const navigationGroups = [
        {
            title: 'Nấu ăn',
            links: [
                [
                    '/recipes',
                    'Công thức'
                ],
                [
                    '/categories',
                    'Danh mục'
                ],
                [
                    '/cook-mode',
                    'Nấu cùng tôi'
                ],
                [
                    '/fridge',
                    'Tủ lạnh'
                ],
                [
                    '/flexible-recipe',
                    'Khẩu phần'
                ],
                [
                    '/journal',
                    'Nhật ký'
                ],
                [
                    '/cookbook',
                    'Sổ tay'
                ],
                [
                    '/planner',
                    'Thực đơn tuần'
                ]
            ]
        },
        {
            title: 'Cộng đồng',
            links: [
                [
                    '/members',
                    'Thành viên'
                ],
                [
                    '/qna',
                    'Hỏi đáp'
                ],
                [
                    '/cook-together',
                    'Nấu chung'
                ],
                [
                    '/seasonal-challenge',
                    'Thử thách'
                ],
                [
                    '/challenges',
                    'Thử thách nấu ăn'
                ]
            ]
        },
        {
            title: 'Tiện ích',
            links: [
                [
                    '/taste-suggestion',
                    'Khẩu vị'
                ],
                [
                    '/ai-chat',
                    'AI Chat'
                ],
                [
                    '/standard-recipe',
                    'Chuẩn quốc tế'
                ],
                [
                    '/editor-picks',
                    'Biên tập'
                ],
                [
                    '/author-profile',
                    'Tác giả'
                ],
                [
                    '/print-export',
                    'In ấn'
                ],
                [
                    '/multilingual',
                    'Ngôn ngữ'
                ],
                [
                    '/saved',
                    'Công thức đã lưu'
                ]
            ]
        },
        {
            title: 'Tài khoản',
            links: [
                [
                    '/account',
                    'Cài đặt tài khoản'
                ],
                [
                    '/notifications',
                    'Thông báo'
                ],
                [
                    '/creator',
                    'Thống kê tác giả'
                ],
                [
                    '/drafts',
                    'Bản nháp'
                ],
                [
                    '/safety',
                    'An toàn cộng đồng'
                ]
            ]
        }
    ];
    const isActive = (path)=>pathname === path || path !== '/community' && pathname.startsWith(`${path}/`);
    const AppLink = ({ to, ...props })=>useNextLinks ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: to,
            ...props
        }, void 0, false, {
            fileName: "[project]/src/CommunityPages.jsx",
            lineNumber: 177,
            columnNumber: 7
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
            to: to,
            ...props
        }, void 0, false, {
            fileName: "[project]/src/CommunityPages.jsx",
            lineNumber: 178,
            columnNumber: 7
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "community-nav",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppLink, {
                to: "/community",
                className: "community-wordmark",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "wordmark-mark",
                        children: "B"
                    }, void 0, false, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 182,
                        columnNumber: 63
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "Bếp Nhà",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: t('CỘNG ĐỒNG ẨM THỰC')
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 182,
                                columnNumber: 116
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 182,
                        columnNumber: 103
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                "aria-label": t('Điều hướng chính'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppLink, {
                        to: "/community",
                        className: `community-nav-home${isActive('/community') ? ' active' : ''}`,
                        "aria-current": isActive('/community') ? 'page' : undefined,
                        children: t('Bảng tin')
                    }, void 0, false, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this),
                    navigationGroups.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                            className: "community-nav-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                    children: [
                                        t(group.title),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": "true",
                                            children: "⌄"
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 187,
                                            columnNumber: 38
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "community-nav-group-links",
                                    children: group.links.map(([path, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppLink, {
                                            to: path,
                                            className: isActive(path) ? 'active' : '',
                                            "aria-current": isActive(path) ? 'page' : undefined,
                                            children: t(label)
                                        }, path, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 190,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, group.title, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 183,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "community-nav-account",
                children: me ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppLink, {
                            to: `/members/${encodeURIComponent(me.username)}`,
                            className: "nav-profile",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                    user: me,
                                    size: "small"
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 200,
                                    columnNumber: 95
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: me.fullName || me.username
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 200,
                                    columnNumber: 128
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 200,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: logout,
                            children: t('Đăng xuất')
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 199,
                    columnNumber: 15
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppLink, {
                            to: "/login",
                            className: "nav-login",
                            children: t('Đăng nhập')
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 203,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppLink, {
                            to: "/register",
                            className: "nav-join",
                            children: t('Tạo tài khoản')
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 204,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 202,
                    columnNumber: 15
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 198,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
_s(CommunityNavContent, "JgbwIc5Or3uHmNQitef0MpMM2lQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c1 = CommunityNavContent;
function CommunityNav() {
    _s1();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const { pathname } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommunityNavContent, {
        navigate: navigate,
        pathname: pathname
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 214,
        columnNumber: 10
    }, this);
}
_s1(CommunityNav, "AbZIq+v0jF2kv1zLgfw1JETZJG8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"]
    ];
});
_c2 = CommunityNav;
function NextCommunityNav() {
    _s2();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommunityNavContent, {
        navigate: (path)=>router.push(path),
        pathname: pathname,
        useNextLinks: true
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 220,
        columnNumber: 10
    }, this);
}
_s2(NextCommunityNav, "gA9e4WsoP6a20xDgQgrFkfMP8lc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c3 = NextCommunityNav;
function CommunityLayout({ children, Navigation = CommunityNav }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "community-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Navigation, {}, void 0, false, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 224,
                columnNumber: 41
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 224,
        columnNumber: 10
    }, this);
}
_c4 = CommunityLayout;
function PostMedia({ mediaUrl, mediaType }) {
    if (!mediaUrl) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "post-media",
        children: mediaType === 'video' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
            src: mediaUrl,
            controls: true,
            playsInline: true,
            preload: "metadata"
        }, void 0, false, {
            fileName: "[project]/src/CommunityPages.jsx",
            lineNumber: 230,
            columnNumber: 7
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: mediaUrl,
            alt: "Ảnh đính kèm bài viết",
            loading: "lazy"
        }, void 0, false, {
            fileName: "[project]/src/CommunityPages.jsx",
            lineNumber: 231,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 229,
        columnNumber: 10
    }, this);
}
_c5 = PostMedia;
function FeedPost({ post, me, onChanged, useNextLinks = false }) {
    _s3();
    const [comment, setComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [replyTo, setReplyTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showComments, setShowComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(post.content);
    const [displayContent, setDisplayContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(post.content);
    const canInteract = Boolean(token());
    const isOwner = me?.username === post.author.username;
    const PostLink = useNextLinks ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"];
    const authorLinkProps = useNextLinks ? {
        href: `/members/${encodeURIComponent(post.author.username)}`
    } : {
        to: `/members/${encodeURIComponent(post.author.username)}`
    };
    const loginLinkProps = useNextLinks ? {
        href: '/login'
    } : {
        to: '/login'
    };
    const like = async ()=>{
        if (!canInteract) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đăng nhập để thả tim bài viết.');
        try {
            await apiRequest(`/community/posts/${post.id}/like`, {
                method: 'POST'
            });
            onChanged();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const submitComment = async (event)=>{
        event.preventDefault();
        if (!comment.trim()) return;
        try {
            await apiRequest(`/community/posts/${post.id}/comments`, {
                method: 'POST',
                body: JSON.stringify({
                    content: comment,
                    parentCommentId: replyTo
                })
            });
            setComment('');
            setReplyTo(null);
            setShowComments(true);
            onChanged();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const deletePost = async ()=>{
        if (!window.confirm('Xóa bài viết này?')) return;
        try {
            await apiRequest(`/community/posts/${post.id}`, {
                method: 'DELETE'
            });
            onChanged();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const savePost = async (event)=>{
        event.preventDefault();
        try {
            const updated = await apiRequest(`/community/posts/${post.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    content: draft
                })
            });
            setDisplayContent(updated.content);
            setEditing(false);
            onChanged();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const toggleComments = async ()=>{
        try {
            await apiRequest(`/community/posts/${post.id}/comments-enabled`, {
                method: 'PUT',
                body: JSON.stringify({
                    enabled: !post.commentsEnabled
                })
            });
            onChanged();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const reportPost = async ()=>{
        if (!canInteract) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đăng nhập để báo cáo bài viết.');
        const reason = window.prompt('Vì sao bạn muốn báo cáo bài viết này?');
        if (!reason?.trim()) return;
        try {
            const result = await apiRequest(`/community/posts/${post.id}/report`, {
                method: 'POST',
                body: JSON.stringify({
                    reason
                })
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(result.message);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const blockAuthor = async ()=>{
        if (!canInteract) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đăng nhập để chặn thành viên.');
        if (!window.confirm(`Chặn @${post.author.username}? Bài viết của người này sẽ bị ẩn khỏi bảng tin.`)) return;
        try {
            await apiRequest(`/community/users/${encodeURIComponent(post.author.username)}/block`, {
                method: 'POST'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã chặn thành viên.');
            onChanged();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "feed-post",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "post-author-row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PostLink, {
                        ...authorLinkProps,
                        className: "post-author-link",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                user: post.author
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 308,
                                columnNumber: 69
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: post.author.fullName || post.author.username
                                    }, void 0, false, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 308,
                                        columnNumber: 104
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        children: [
                                            "@",
                                            post.author.username,
                                            " · ",
                                            new Date(post.createdAt).toLocaleString('vi-VN')
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 308,
                                        columnNumber: 167
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 308,
                                columnNumber: 98
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 308,
                        columnNumber: 9
                    }, this),
                    isOwner ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "post-owner-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setDraft(displayContent);
                                    setEditing((value)=>!value);
                                },
                                children: editing ? 'Đóng sửa' : 'Sửa'
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 309,
                                columnNumber: 56
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: deletePost,
                                children: "Xóa"
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 309,
                                columnNumber: 191
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: toggleComments,
                                children: post.commentsEnabled ? 'Tắt bình luận' : 'Bật bình luận'
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 309,
                                columnNumber: 246
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 309,
                        columnNumber: 20
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "post-owner-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: reportPost,
                                children: "Báo cáo"
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 309,
                                columnNumber: 405
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: blockAuthor,
                                children: "Chặn"
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 309,
                                columnNumber: 464
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 309,
                        columnNumber: 369
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 307,
                columnNumber: 7
            }, this),
            editing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "post-edit-form",
                onSubmit: savePost,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: draft,
                        onChange: (event)=>setDraft(event.target.value),
                        maxLength: 3000,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 311,
                        columnNumber: 71
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    draft.length,
                                    "/3000"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 311,
                                columnNumber: 177
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: !draft.trim(),
                                children: "Lưu sửa đổi"
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 311,
                                columnNumber: 209
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 311,
                        columnNumber: 172
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 311,
                columnNumber: 18
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "post-copy",
                children: displayContent
            }, void 0, false, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 311,
                columnNumber: 292
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PostMedia, {
                mediaUrl: post.mediaUrl,
                mediaType: post.mediaType
            }, void 0, false, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 312,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "post-actions",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: post.likedByMe ? 'is-liked' : '',
                        onClick: like,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                children: "♥"
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 314,
                                columnNumber: 91
                            }, this),
                            " ",
                            post.likesCount || 0
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 314,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: !post.commentsEnabled,
                        onClick: ()=>setShowComments((value)=>!value),
                        children: [
                            "Bình luận ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: post.comments?.length || 0
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 315,
                                columnNumber: 125
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 315,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 313,
                columnNumber: 7
            }, this),
            !post.commentsEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "comments-closed",
                children: "Tác giả đã tắt bình luận."
            }, void 0, false, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 317,
                columnNumber: 33
            }, this),
            showComments && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "post-comments",
                children: [
                    (post.comments || []).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `comment-line ${item.parentCommentId ? 'comment-reply' : ''}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                    user: item.author,
                                    size: "tiny"
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 319,
                                    columnNumber: 137
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: item.author.fullName || item.author.username
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 319,
                                            columnNumber: 181
                                        }, this),
                                        " ",
                                        item.content,
                                        canInteract && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "reply-comment-button",
                                            onClick: ()=>setReplyTo(item.id),
                                            children: "Trả lời"
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 319,
                                            columnNumber: 275
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 319,
                                    columnNumber: 178
                                }, this)
                            ]
                        }, item.id, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 319,
                            columnNumber: 44
                        }, this)),
                    canInteract ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: submitComment,
                        className: "comment-form",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: comment,
                                onChange: (event)=>setComment(event.target.value),
                                placeholder: replyTo ? 'Trả lời bình luận...' : 'Viết bình luận...',
                                maxLength: 1000
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 320,
                                columnNumber: 80
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                children: "Gửi"
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 320,
                                columnNumber: 242
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 320,
                        columnNumber: 24
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "comment-signin",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PostLink, {
                                ...loginLinkProps,
                                children: "Đăng nhập"
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 320,
                                columnNumber: 316
                            }, this),
                            " để tham gia trò chuyện."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 320,
                        columnNumber: 286
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 318,
                columnNumber: 24
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 306,
        columnNumber: 5
    }, this);
}
_s3(FeedPost, "XAL7X5GZ9arxNz4wDZ+d/1xAUz4=");
_c6 = FeedPost;
function FeedPage() {
    _s4();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const [posts, setPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [me, setMe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [articles, setArticles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(EDITORIAL_STARTERS);
    const [articleFormOpen, setArticleFormOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [savingArticle, setSavingArticle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [articleDraft, setArticleDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        summary: '',
        content: '',
        coverImageUrl: ''
    });
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [media, setMedia] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploadingMedia, setUploadingMedia] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDraft, setIsDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scope, setScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('discover');
    const [sort, setSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('recent');
    const [reloadKey, setReloadKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const refresh = ()=>setReloadKey((value)=>value + 1);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FeedPage.useEffect": ()=>{
            let active = true;
            apiRequest(`/community/feed?scope=${scope}&sort=${sort}`).then({
                "FeedPage.useEffect": (data)=>{
                    if (active) setPosts(data);
                }
            }["FeedPage.useEffect"]).catch({
                "FeedPage.useEffect": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message)
            }["FeedPage.useEffect"]).finally({
                "FeedPage.useEffect": ()=>{
                    if (active) setLoading(false);
                }
            }["FeedPage.useEffect"]);
            return ({
                "FeedPage.useEffect": ()=>{
                    active = false;
                }
            })["FeedPage.useEffect"];
        }
    }["FeedPage.useEffect"], [
        scope,
        sort,
        reloadKey
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FeedPage.useEffect": ()=>{
            if (token()) apiRequest('/account/me').then(setMe).catch({
                "FeedPage.useEffect": ()=>{}
            }["FeedPage.useEffect"]);
        }
    }["FeedPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FeedPage.useEffect": ()=>{
            let active = true;
            apiRequest('/articles?take=10').then({
                "FeedPage.useEffect": (data)=>{
                    if (active) setArticles([
                        ...data,
                        ...EDITORIAL_STARTERS
                    ].sort({
                        "FeedPage.useEffect": (a, b)=>new Date(b.createdAt) - new Date(a.createdAt)
                    }["FeedPage.useEffect"]));
                }
            }["FeedPage.useEffect"]).catch({
                "FeedPage.useEffect": ()=>{
                    if (active) setArticles(EDITORIAL_STARTERS);
                }
            }["FeedPage.useEffect"]);
            return ({
                "FeedPage.useEffect": ()=>{
                    active = false;
                }
            })["FeedPage.useEffect"];
        }
    }["FeedPage.useEffect"], []);
    const changeScope = (value)=>{
        if (value === 'following' && !token()) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đăng nhập để xem bảng tin đang theo dõi.');
        setLoading(true);
        setScope(value);
    };
    const publish = async (event)=>{
        event.preventDefault();
        if (!content.trim() && !media || saving || uploadingMedia) return;
        setSaving(true);
        try {
            await apiRequest('/community/posts', {
                method: 'POST',
                body: JSON.stringify({
                    content,
                    isDraft,
                    mediaUrl: media?.mediaUrl || null,
                    mediaType: media?.mediaType || null
                })
            });
            setContent('');
            setMedia(null);
            setIsDraft(false);
            if (!isDraft) refresh();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(isDraft ? 'Đã lưu vào bản nháp.' : 'Bài viết đã lên bảng tin.');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        } finally{
            setSaving(false);
        }
    };
    const uploadMedia = async (event)=>{
        const file = event.target.files?.[0];
        if (!file) return;
        const isVideo = file.type.startsWith('video/');
        const maxSize = isVideo ? 50 * 1024 * 1024 : 8 * 1024 * 1024;
        if (file.size > maxSize) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(isVideo ? 'Video tối đa 50 MB.' : 'Ảnh tối đa 8 MB.');
            event.target.value = '';
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        setUploadingMedia(true);
        try {
            const response = await fetch(`${API}/community/upload-media`, {
                method: 'POST',
                headers: authHeaders(),
                body: formData
            });
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readApiResponse"])(response);
            if (!response.ok) throw new Error(data.message || 'Tải tệp lên thất bại.');
            setMedia(data);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(isVideo ? 'Video đã sẵn sàng.' : 'Ảnh đã sẵn sàng.');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        } finally{
            setUploadingMedia(false);
            event.target.value = '';
        }
    };
    const publishArticle = async (event)=>{
        event.preventDefault();
        if (savingArticle) return;
        setSavingArticle(true);
        try {
            const article = await apiRequest('/articles', {
                method: 'POST',
                body: JSON.stringify(articleDraft)
            });
            setArticles((current)=>[
                    article,
                    ...current
                ]);
            setArticleDraft({
                title: '',
                summary: '',
                content: '',
                coverImageUrl: ''
            });
            setArticleFormOpen(false);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Bài báo đã được đăng.');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        } finally{
            setSavingArticle(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommunityLayout, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "community-main feed-layout",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feed-hero",
                    "aria-label": "Bài viết tiêu điểm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: EDITORIAL_STARTERS[0].coverImageUrl,
                            alt: "Mâm món ăn nhiều màu sắc trên bàn"
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 424,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feed-hero-copy",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "community-kicker",
                                    children: "BẾP NHÀ · CHUYỆN MÓN NGON"
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 426,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: EDITORIAL_STARTERS[0].title
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 427,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: EDITORIAL_STARTERS[0].summary
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 428,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                    to: `/articles/${EDITORIAL_STARTERS[0].slug}`,
                                    children: [
                                        "Đọc bài viết ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": "true",
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 429,
                                            columnNumber: 77
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 429,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 425,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "feed-hero-index",
                            children: "01 / GÓC BẾP"
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 431,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 423,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feed-column",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feed-heading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "community-kicker",
                                            children: t('BẾP NHÀ · CỘNG ĐỒNG')
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 434,
                                            columnNumber: 44
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            children: t('Bảng tin')
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 434,
                                            columnNumber: 106
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 434,
                                    columnNumber: 39
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "feed-live",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 434,
                                            columnNumber: 164
                                        }, this),
                                        " ",
                                        t('MỌI NGƯỜI ĐANG CHIA SẺ')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 434,
                                    columnNumber: 136
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 434,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feed-control-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "feed-tabs",
                                    role: "tablist",
                                    "aria-label": t('Nguồn bài viết'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: scope === 'discover' ? 'active' : '',
                                            onClick: ()=>changeScope('discover'),
                                            children: t('Dành cho bạn')
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 435,
                                            columnNumber: 118
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: scope === 'following' ? 'active' : '',
                                            onClick: ()=>changeScope('following'),
                                            children: t('Đang theo dõi')
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 435,
                                            columnNumber: 257
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 435,
                                    columnNumber: 43
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    "aria-label": t('Sắp xếp bài viết'),
                                    value: sort,
                                    onChange: (event)=>{
                                        setLoading(true);
                                        setSort(event.target.value);
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "recent",
                                            children: t('Mới nhất')
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 435,
                                            columnNumber: 531
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "popular",
                                            children: t('Nổi bật')
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 435,
                                            columnNumber: 578
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 435,
                                    columnNumber: 405
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 435,
                            columnNumber: 9
                        }, this),
                        me ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "composer",
                            onSubmit: publish,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "composer-top",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                            user: me
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 436,
                                            columnNumber: 91
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: content,
                                            onChange: (event)=>setContent(event.target.value),
                                            placeholder: t('Hôm nay bạn vừa nấu món gì? Chia sẻ với mọi người...'),
                                            maxLength: 3000
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 436,
                                            columnNumber: 111
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 436,
                                    columnNumber: 61
                                }, this),
                                media && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "composer-media",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PostMedia, {
                                            mediaUrl: media.mediaUrl,
                                            mediaType: media.mediaType
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 436,
                                            columnNumber: 327
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setMedia(null),
                                            children: t('Gỡ tệp')
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 436,
                                            columnNumber: 394
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 436,
                                    columnNumber: 295
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "composer-bottom",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "composer-attach",
                                            children: [
                                                uploadingMedia ? t('Đang tải...') : t('Ảnh/video'),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "file",
                                                    accept: "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm",
                                                    onChange: uploadMedia,
                                                    disabled: uploadingMedia || saving
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 436,
                                                    columnNumber: 596
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 436,
                                            columnNumber: 509
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "draft-toggle",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: isDraft,
                                                    onChange: (event)=>setIsDraft(event.target.checked)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 436,
                                                    columnNumber: 788
                                                }, this),
                                                " ",
                                                t('Lưu bản nháp')
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 436,
                                            columnNumber: 756
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                content.length,
                                                "/3000"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 436,
                                            columnNumber: 912
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: !content.trim() && !media || saving || uploadingMedia,
                                            children: [
                                                saving ? t('Đang lưu...') : isDraft ? t('Lưu nháp') : t('Đăng bài'),
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "↗"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 436,
                                                    columnNumber: 1105
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 436,
                                            columnNumber: 946
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 436,
                                    columnNumber: 476
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 436,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "guest-invite",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: t('Bếp vui hơn khi có bạn.')
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 436,
                                            columnNumber: 1173
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: t('Tạo tài khoản để chia sẻ câu chuyện, lưu kết nối và trò chuyện cùng cộng đồng.')
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 436,
                                            columnNumber: 1220
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 436,
                                    columnNumber: 1168
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                    to: "/register",
                                    children: [
                                        t('Tham gia Bếp Nhà'),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 436,
                                            columnNumber: 1363
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 436,
                                    columnNumber: 1318
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 436,
                            columnNumber: 1138
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feed-list",
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "feed-empty",
                                children: t('Đang tải bảng tin...')
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 437,
                                columnNumber: 47
                            }, this) : posts.length ? posts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeedPost, {
                                    post: post,
                                    me: me,
                                    onChanged: refresh
                                }, post.id, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 437,
                                    columnNumber: 144
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "feed-empty",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "✳"
                                    }, void 0, false, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 437,
                                        columnNumber: 242
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: t('Bảng tin đang chờ câu chuyện đầu tiên')
                                    }, void 0, false, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 437,
                                        columnNumber: 256
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: t('Hãy chia sẻ món ăn, mẹo bếp hoặc một khoảnh khắc đáng nhớ.')
                                    }, void 0, false, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 437,
                                        columnNumber: 309
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 437,
                                columnNumber: 214
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 437,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 433,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                    className: "editorial-column",
                    "aria-label": "Bài báo và chuyên đề",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "editorial-heading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "community-kicker",
                                            children: "ĐỌC THÊM"
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 441,
                                            columnNumber: 16
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: "Chuyện trong bếp"
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 441,
                                            columnNumber: 60
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 441,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setArticleFormOpen((open)=>!open),
                                    "aria-expanded": articleFormOpen,
                                    "aria-controls": "article-composer",
                                    children: [
                                        articleFormOpen ? 'Đóng' : 'Viết bài',
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": "true",
                                            children: articleFormOpen ? '×' : '+'
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 442,
                                            columnNumber: 188
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 442,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 440,
                            columnNumber: 9
                        }, this),
                        articleFormOpen && (me ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            id: "article-composer",
                            className: "article-composer",
                            onSubmit: publishArticle,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Tiêu đề",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: articleDraft.title,
                                            onChange: (event)=>setArticleDraft({
                                                    ...articleDraft,
                                                    title: event.target.value
                                                }),
                                            minLength: 5,
                                            maxLength: 160,
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 445,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 445,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Mô tả ngắn",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: articleDraft.summary,
                                            onChange: (event)=>setArticleDraft({
                                                    ...articleDraft,
                                                    summary: event.target.value
                                                }),
                                            minLength: 20,
                                            maxLength: 500,
                                            rows: 3,
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 446,
                                            columnNumber: 28
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 446,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Nội dung bài báo",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: articleDraft.content,
                                            onChange: (event)=>setArticleDraft({
                                                    ...articleDraft,
                                                    content: event.target.value
                                                }),
                                            minLength: 80,
                                            maxLength: 20000,
                                            rows: 8,
                                            placeholder: "Viết các đoạn cách nhau bằng một dòng trống...",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 447,
                                            columnNumber: 34
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 447,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Ảnh bìa (URL)",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "url",
                                            value: articleDraft.coverImageUrl,
                                            onChange: (event)=>setArticleDraft({
                                                    ...articleDraft,
                                                    coverImageUrl: event.target.value
                                                }),
                                            placeholder: "https://..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 448,
                                            columnNumber: 31
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 448,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: savingArticle,
                                    children: savingArticle ? 'Đang đăng...' : 'Đăng bài báo'
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 449,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 444,
                            columnNumber: 35
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: "article-composer",
                            className: "article-signin",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Đăng nhập để chia sẻ bài viết dài của bạn với cộng đồng."
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 450,
                                    columnNumber: 73
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                    to: "/login",
                                    children: [
                                        "Đăng nhập để viết ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": "true",
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 450,
                                            columnNumber: 172
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 450,
                                    columnNumber: 136
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 450,
                            columnNumber: 19
                        }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "editorial-list",
                            children: articles.map((article, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                    className: "editorial-card",
                                    to: `/articles/${article.slug}`,
                                    children: [
                                        article.coverImageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: article.coverImageUrl,
                                            alt: "",
                                            loading: "lazy"
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 453,
                                            columnNumber: 39
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "editorial-card-copy",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: [
                                                        index === 0 ? 'TIÊU ĐIỂM' : 'CHUYỆN BẾP NHÀ',
                                                        " · ",
                                                        new Date(article.createdAt).toLocaleDateString('vi-VN')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 454,
                                                    columnNumber: 51
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: article.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 454,
                                                    columnNumber: 172
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: article.summary
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 454,
                                                    columnNumber: 204
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 454,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "editorial-card-arrow",
                                            "aria-hidden": "true",
                                            children: "↗"
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 455,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, article.id || article.slug, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 452,
                                    columnNumber: 45
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 451,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 439,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/CommunityPages.jsx",
            lineNumber: 422,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 421,
        columnNumber: 10
    }, this);
}
_s4(FeedPage, "aWYDSFV1/tTHIoHtVmdqxYHMEa0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c7 = FeedPage;
function ArticleContent({ slug, Navigation = CommunityNav, useNextLinks = false }) {
    _s5();
    const starterArticle = EDITORIAL_STARTERS.find((item)=>item.slug === slug);
    const [article, setArticle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(starterArticle || null);
    const [loadedSlug, setLoadedSlug] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ArticleContent.useEffect": ()=>{
            let active = true;
            if (EDITORIAL_STARTERS.some({
                "ArticleContent.useEffect": (item)=>item.slug === slug
            }["ArticleContent.useEffect"])) return ({
                "ArticleContent.useEffect": ()=>{
                    active = false;
                }
            })["ArticleContent.useEffect"];
            apiRequest(`/articles/${encodeURIComponent(slug)}`).then({
                "ArticleContent.useEffect": (data)=>{
                    if (active) setArticle(data);
                }
            }["ArticleContent.useEffect"]).catch({
                "ArticleContent.useEffect": ()=>{
                    if (active) setArticle(null);
                }
            }["ArticleContent.useEffect"]).finally({
                "ArticleContent.useEffect": ()=>{
                    if (active) setLoadedSlug(slug);
                }
            }["ArticleContent.useEffect"]);
            return ({
                "ArticleContent.useEffect": ()=>{
                    active = false;
                }
            })["ArticleContent.useEffect"];
        }
    }["ArticleContent.useEffect"], [
        slug
    ]);
    const loading = !starterArticle && loadedSlug !== slug;
    const visibleArticle = starterArticle || article;
    const ArticleLink = useNextLinks ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"];
    const feedLinkProps = useNextLinks ? {
        href: '/community'
    } : {
        to: '/community'
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommunityLayout, {
        Navigation: Navigation,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "community-main article-page",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Đang tải bài viết..."
            }, void 0, false, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 482,
                columnNumber: 110
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/CommunityPages.jsx",
            lineNumber: 482,
            columnNumber: 64
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 482,
        columnNumber: 23
    }, this);
    if (!visibleArticle) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommunityLayout, {
        Navigation: Navigation,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "community-main article-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Không tìm thấy bài viết."
                }, void 0, false, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 483,
                    columnNumber: 118
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArticleLink, {
                    ...feedLinkProps,
                    children: "Quay lại bảng tin"
                }, void 0, false, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 483,
                    columnNumber: 149
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/CommunityPages.jsx",
            lineNumber: 483,
            columnNumber: 72
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 483,
        columnNumber: 31
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommunityLayout, {
        Navigation: Navigation,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "community-main article-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArticleLink, {
                    className: "article-back-link",
                    ...feedLinkProps,
                    children: "← Bảng tin"
                }, void 0, false, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 487,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    className: "article-reading",
                    children: [
                        visibleArticle.coverImageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            className: "article-cover",
                            src: visibleArticle.coverImageUrl,
                            alt: visibleArticle.title
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 489,
                            columnNumber: 42
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                            className: "article-reading-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "community-kicker",
                                    children: "BẾP NHÀ · CHUYỆN MÓN NGON"
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 491,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    children: visibleArticle.title
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 492,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "article-summary",
                                    children: visibleArticle.summary
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 493,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "article-byline",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: visibleArticle.author?.fullName || visibleArticle.author?.userName || 'Cộng đồng Bếp Nhà'
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 494,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("time", {
                                            dateTime: visibleArticle.createdAt,
                                            children: new Date(visibleArticle.createdAt).toLocaleDateString('vi-VN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                timeZone: 'UTC'
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 494,
                                            columnNumber: 147
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 494,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 490,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "article-body",
                            children: visibleArticle.content.split(/\n\s*\n/).filter(Boolean).map((paragraph, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: paragraph
                                }, index, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 496,
                                    columnNumber: 122
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 496,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                            className: "article-reading-footer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Hết bài · Cảm ơn bạn đã đọc"
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 497,
                                    columnNumber: 52
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArticleLink, {
                                    ...feedLinkProps,
                                    children: "Khám phá thêm bài viết →"
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 497,
                                    columnNumber: 92
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 497,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 488,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/CommunityPages.jsx",
            lineNumber: 486,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 485,
        columnNumber: 10
    }, this);
}
_s5(ArticleContent, "FcEQjINpegfreaBFB+TT+U6bGsU=");
_c8 = ArticleContent;
function ArticlePage() {
    _s6();
    const { slug } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArticleContent, {
        slug: slug
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 505,
        columnNumber: 10
    }, this);
}
_s6(ArticlePage, "DpOdpe+T7d3Ytb7f6neHj0L13w0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c9 = ArticlePage;
function NextArticlePage() {
    _s7();
    const parameters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const slug = Array.isArray(parameters.slug) ? parameters.slug[0] : parameters.slug;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArticleContent, {
        slug: slug,
        Navigation: NextCommunityNav,
        useNextLinks: true
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 511,
        columnNumber: 10
    }, this);
}
_s7(NextArticlePage, "cMYgyYx30GUP97yTtFTDvOwQA00=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c10 = NextArticlePage;
function MembersDirectoryContent({ Navigation = CommunityNav, useNextLinks = false }) {
    _s8();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MembersDirectoryContent.useEffect": ()=>{
            let active = true;
            const parameters = new URLSearchParams({
                page: String(page),
                pageSize: '24'
            });
            if (query.trim()) parameters.set('q', query.trim());
            const timer = setTimeout({
                "MembersDirectoryContent.useEffect.timer": ()=>apiRequest(`/community/users?${parameters}`).then({
                        "MembersDirectoryContent.useEffect.timer": (data)=>{
                            if (!active) return;
                            setUsers({
                                "MembersDirectoryContent.useEffect.timer": (current)=>page === 1 ? data.items : [
                                        ...current,
                                        ...data.items
                                    ]
                            }["MembersDirectoryContent.useEffect.timer"]);
                            setTotal(data.total);
                        }
                    }["MembersDirectoryContent.useEffect.timer"]).catch({
                        "MembersDirectoryContent.useEffect.timer": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message)
                    }["MembersDirectoryContent.useEffect.timer"]).finally({
                        "MembersDirectoryContent.useEffect.timer": ()=>{
                            if (active) setLoading(false);
                        }
                    }["MembersDirectoryContent.useEffect.timer"])
            }["MembersDirectoryContent.useEffect.timer"], 200);
            return ({
                "MembersDirectoryContent.useEffect": ()=>{
                    active = false;
                    clearTimeout(timer);
                }
            })["MembersDirectoryContent.useEffect"];
        }
    }["MembersDirectoryContent.useEffect"], [
        query,
        page
    ]);
    const toggleFollow = async (user)=>{
        if (user.isSelf) return;
        if (!token()) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đăng nhập để theo dõi thành viên.');
        try {
            const endpoint = `/community/users/${encodeURIComponent(user.username)}/follow`;
            const result = user.isFollowing ? (await apiRequest(endpoint, {
                method: 'DELETE'
            }), false) : (await apiRequest(endpoint, {
                method: 'POST'
            })).following;
            setUsers((current)=>current.map((item)=>item.username === user.username ? {
                        ...item,
                        isFollowing: result
                    } : item));
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const ProfileLink = useNextLinks ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"];
    const profileLinkProps = (username)=>useNextLinks ? {
            href: `/members/${encodeURIComponent(username)}`
        } : {
            to: `/members/${encodeURIComponent(username)}`
        };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommunityLayout, {
        Navigation: Navigation,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "community-main directory-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "directory-head",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "community-kicker",
                            children: "NHỮNG NGƯỜI CÙNG YÊU BẾP"
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 550,
                            columnNumber: 135
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: "Tìm người truyền cảm hứng."
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 550,
                            columnNumber: 195
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Khám phá mọi thành viên Bếp Nhà, tìm theo tên hoặc username và xem những gì họ chia sẻ."
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 550,
                            columnNumber: 230
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "member-search",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "⌕"
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 550,
                                    columnNumber: 357
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: query,
                                    onChange: (event)=>{
                                        setQuery(event.target.value);
                                        setPage(1);
                                        setUsers([]);
                                        setTotal(0);
                                        setLoading(true);
                                    },
                                    placeholder: "Tìm theo tên hoặc username",
                                    autoComplete: "off"
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 550,
                                    columnNumber: 371
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 550,
                            columnNumber: 324
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 550,
                    columnNumber: 99
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "member-results",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "results-heading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: query.trim() ? `Kết quả cho “${query}”` : 'Tất cả thành viên'
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 550,
                                    columnNumber: 651
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        users.length,
                                        " / ",
                                        total
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 550,
                                    columnNumber: 723
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 550,
                            columnNumber: 618
                        }, this),
                        loading && users.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feed-empty",
                            children: "Đang tải thành viên..."
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 550,
                            columnNumber: 799
                        }, this) : users.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "member-grid",
                                    children: users.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: "member-card",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileLink, {
                                                    ...profileLinkProps(user.username),
                                                    className: "member-card-person",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                            user: user,
                                                            size: "large"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/CommunityPages.jsx",
                                                            lineNumber: 550,
                                                            columnNumber: 1057
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: user.fullName || user.username
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                                    lineNumber: 550,
                                                                    columnNumber: 1098
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                    children: [
                                                                        "@",
                                                                        user.username
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                                    lineNumber: 550,
                                                                    columnNumber: 1147
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/CommunityPages.jsx",
                                                            lineNumber: 550,
                                                            columnNumber: 1092
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 550,
                                                    columnNumber: 976
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: user.bio || 'Chưa thêm giới thiệu.'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 550,
                                                    columnNumber: 1199
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "member-card-actions",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileLink, {
                                                            ...profileLinkProps(user.username),
                                                            children: [
                                                                user.isSelf ? 'Trang cá nhân' : 'Xem hồ sơ',
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "↗"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                                    lineNumber: 550,
                                                                    columnNumber: 1376
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/CommunityPages.jsx",
                                                            lineNumber: 550,
                                                            columnNumber: 1280
                                                        }, this),
                                                        !user.isSelf && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            className: user.isFollowing ? 'followed' : '',
                                                            onClick: ()=>toggleFollow(user),
                                                            children: user.isFollowing ? 'Đang theo dõi' : 'Theo dõi +'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/CommunityPages.jsx",
                                                            lineNumber: 550,
                                                            columnNumber: 1421
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 550,
                                                    columnNumber: 1243
                                                }, this)
                                            ]
                                        }, user.username, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 550,
                                            columnNumber: 923
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 550,
                                    columnNumber: 875
                                }, this),
                                users.length < total && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "load-more-wrap",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "load-more-button",
                                        disabled: loading,
                                        onClick: ()=>{
                                            setLoading(true);
                                            setPage((current)=>current + 1);
                                        },
                                        children: loading ? 'Đang tải...' : 'Xem thêm thành viên'
                                    }, void 0, false, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 550,
                                        columnNumber: 1667
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 550,
                                    columnNumber: 1635
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 550,
                            columnNumber: 873
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feed-empty",
                            children: "Không tìm thấy thành viên phù hợp."
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 550,
                            columnNumber: 1878
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 550,
                    columnNumber: 582
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/CommunityPages.jsx",
            lineNumber: 550,
            columnNumber: 51
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 550,
        columnNumber: 10
    }, this);
}
_s8(MembersDirectoryContent, "4pz1gPIelPprL2H3h8um1H6gIYc=");
_c11 = MembersDirectoryContent;
function MembersPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MembersDirectoryContent, {}, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 554,
        columnNumber: 10
    }, this);
}
_c12 = MembersPage;
function NextMembersPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MembersDirectoryContent, {
        Navigation: NextCommunityNav,
        useNextLinks: true
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 558,
        columnNumber: 10
    }, this);
}
_c13 = NextMembersPage;
function ProfilePost({ post, isOwner, onChanged }) {
    _s9();
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(post.content);
    const [displayContent, setDisplayContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(post.content);
    const save = async (event)=>{
        event.preventDefault();
        try {
            const updated = await apiRequest(`/community/posts/${post.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    content: draft
                })
            });
            setDisplayContent(updated.content);
            setEditing(false);
            onChanged();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const remove = async ()=>{
        if (!window.confirm('Xóa bài viết này?')) return;
        try {
            await apiRequest(`/community/posts/${post.id}`, {
                method: 'DELETE'
            });
            onChanged();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "feed-post profile-post",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "profile-post-top",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("time", {
                        children: new Date(post.createdAt).toLocaleString('vi-VN')
                    }, void 0, false, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 583,
                        columnNumber: 39
                    }, this),
                    isOwner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "post-owner-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setDraft(displayContent);
                                    setEditing((value)=>!value);
                                },
                                children: editing ? 'Đóng sửa' : 'Sửa'
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 583,
                                columnNumber: 150
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: remove,
                                children: "Xóa"
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 583,
                                columnNumber: 285
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 583,
                        columnNumber: 114
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 583,
                columnNumber: 5
            }, this),
            editing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "post-edit-form",
                onSubmit: save,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: draft,
                        onChange: (event)=>setDraft(event.target.value),
                        maxLength: 3000,
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 584,
                        columnNumber: 65
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    draft.length,
                                    "/3000"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 584,
                                columnNumber: 171
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: !draft.trim(),
                                children: "Lưu sửa đổi"
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 584,
                                columnNumber: 203
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 584,
                        columnNumber: 166
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 584,
                columnNumber: 16
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "post-copy",
                children: displayContent
            }, void 0, false, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 584,
                columnNumber: 286
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PostMedia, {
                mediaUrl: post.mediaUrl,
                mediaType: post.mediaType
            }, void 0, false, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 585,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "profile-like-count",
                children: [
                    "♥ ",
                    post.likesCount
                ]
            }, void 0, true, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 586,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 582,
        columnNumber: 10
    }, this);
}
_s9(ProfilePost, "3E4+/96X4qU7gMGR+mjOYga3abg=");
_c14 = ProfilePost;
function MemberProfileContent({ username, navigate, Navigation = CommunityNav, useNextLinks = false }) {
    _s10();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [refreshKey, setRefreshKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [connectionMode, setConnectionMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [connections, setConnections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [connectionsLoading, setConnectionsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MemberProfileContent.useEffect": ()=>{
            let active = true;
            apiRequest(`/community/profiles/${encodeURIComponent(username)}`).then({
                "MemberProfileContent.useEffect": (result)=>{
                    if (active) setData(result);
                }
            }["MemberProfileContent.useEffect"]).catch({
                "MemberProfileContent.useEffect": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message)
            }["MemberProfileContent.useEffect"]).finally({
                "MemberProfileContent.useEffect": ()=>{
                    if (active) setLoading(false);
                }
            }["MemberProfileContent.useEffect"]);
            return ({
                "MemberProfileContent.useEffect": ()=>{
                    active = false;
                }
            })["MemberProfileContent.useEffect"];
        }
    }["MemberProfileContent.useEffect"], [
        username,
        refreshKey
    ]);
    const showConnections = async (mode)=>{
        setConnectionMode(mode);
        setConnectionsLoading(true);
        try {
            setConnections(await apiRequest(`/community/profiles/${encodeURIComponent(username)}/${mode}`));
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        } finally{
            setConnectionsLoading(false);
        }
    };
    const toggleFollow = async ()=>{
        if (!token()) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đăng nhập để theo dõi thành viên.');
        try {
            const path = `/community/users/${encodeURIComponent(username)}/follow`;
            const following = data.isFollowing ? (await apiRequest(path, {
                method: 'DELETE'
            }), false) : (await apiRequest(path, {
                method: 'POST'
            })).following;
            setData((current)=>current && {
                    ...current,
                    isFollowing: following,
                    followersCount: current.followersCount + (following ? 1 : -1)
                });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const reportUser = async ()=>{
        if (!token()) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đăng nhập để báo cáo thành viên.');
        const reason = window.prompt('Vì sao bạn muốn báo cáo thành viên này?');
        if (!reason?.trim()) return;
        try {
            const result = await apiRequest(`/community/users/${encodeURIComponent(username)}/report`, {
                method: 'POST',
                body: JSON.stringify({
                    reason
                })
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(result.message);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const blockUser = async ()=>{
        if (!token()) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đăng nhập để chặn thành viên.');
        if (!window.confirm(`Chặn @${username}? Bài viết của người này sẽ bị ẩn khỏi bảng tin.`)) return;
        try {
            await apiRequest(`/community/users/${encodeURIComponent(username)}/block`, {
                method: 'POST'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã chặn thành viên.');
            navigate('/members');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const manageConnection = async (user)=>{
        if (!data?.isOwnProfile) return;
        try {
            if (connectionMode === 'following') {
                await apiRequest(`/community/users/${encodeURIComponent(user.username)}/follow`, {
                    method: 'DELETE'
                });
                setData((current)=>current && {
                        ...current,
                        followingCount: current.followingCount - 1
                    });
            } else {
                await apiRequest(`/community/users/${encodeURIComponent(user.username)}/followers`, {
                    method: 'DELETE'
                });
                setData((current)=>current && {
                        ...current,
                        followersCount: current.followersCount - 1
                    });
            }
            setConnections((current)=>current.filter((item)=>item.username !== user.username));
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const followFromConnections = async (user)=>{
        if (!token()) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đăng nhập để theo dõi thành viên.');
        try {
            const path = `/community/users/${encodeURIComponent(user.username)}/follow`;
            const following = user.isFollowing ? (await apiRequest(path, {
                method: 'DELETE'
            }), false) : (await apiRequest(path, {
                method: 'POST'
            })).following;
            setConnections((current)=>current.map((item)=>item.username === user.username ? {
                        ...item,
                        isFollowing: following
                    } : item));
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const ProfileLink = useNextLinks ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"];
    const profileLinkProps = (targetUsername)=>useNextLinks ? {
            href: `/members/${encodeURIComponent(targetUsername)}`
        } : {
            to: `/members/${encodeURIComponent(targetUsername)}`
        };
    const accountLinkProps = useNextLinks ? {
        href: '/account'
    } : {
        to: '/account'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommunityLayout, {
        Navigation: Navigation,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "community-main profile-page",
            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "feed-empty",
                children: "Đang tải hồ sơ..."
            }, void 0, false, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 669,
                columnNumber: 108
            }, this) : data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "profile-banner",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "profile-identity",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                        user: data.profile,
                                        size: "profile"
                                    }, void 0, false, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 671,
                                        columnNumber: 41
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "community-kicker",
                                                children: "THÀNH VIÊN BẾP NHÀ"
                                            }, void 0, false, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 671,
                                                columnNumber: 91
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                children: data.profile.fullName || data.profile.username
                                            }, void 0, false, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 671,
                                                columnNumber: 145
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "@",
                                                    data.profile.username
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 671,
                                                columnNumber: 202
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 671,
                                        columnNumber: 86
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 671,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "profile-stats",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: data.posts.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 673,
                                                columnNumber: 14
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "BÀI VIẾT"
                                            }, void 0, false, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 673,
                                                columnNumber: 50
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 673,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>showConnections('followers'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: data.followersCount
                                            }, void 0, false, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 674,
                                                columnNumber: 76
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "NGƯỜI THEO DÕI"
                                            }, void 0, false, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 674,
                                                columnNumber: 114
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 674,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>showConnections('following'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: data.followingCount
                                            }, void 0, false, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 675,
                                                columnNumber: 76
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "ĐANG THEO DÕI"
                                            }, void 0, false, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 675,
                                                columnNumber: 114
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 675,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 672,
                                columnNumber: 7
                            }, this),
                            data.isOwnProfile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileLink, {
                                className: "profile-follow",
                                ...accountLinkProps,
                                children: "Cài đặt hồ sơ"
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 677,
                                columnNumber: 28
                            }, this) : token() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "profile-community-actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `profile-follow ${data.isFollowing ? 'followed' : ''}`,
                                        type: "button",
                                        onClick: toggleFollow,
                                        children: data.isFollowing ? 'Đang theo dõi · Bỏ theo dõi' : 'Theo dõi thành viên +'
                                    }, void 0, false, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 677,
                                        columnNumber: 174
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: reportUser,
                                        children: "Báo cáo"
                                    }, void 0, false, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 677,
                                        columnNumber: 371
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: blockUser,
                                        children: "Chặn"
                                    }, void 0, false, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 677,
                                        columnNumber: 430
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 677,
                                columnNumber: 131
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 670,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "profile-bio",
                        children: data.profile.bio || 'Thành viên này chưa thêm phần giới thiệu.'
                    }, void 0, false, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 679,
                        columnNumber: 5
                    }, this),
                    connectionMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "connections-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: connectionMode === 'followers' ? 'Người theo dõi' : 'Đang theo dõi'
                                    }, void 0, false, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 680,
                                        columnNumber: 71
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setConnectionMode(''),
                                        children: "Đóng"
                                    }, void 0, false, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 680,
                                        columnNumber: 149
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 680,
                                columnNumber: 63
                            }, this),
                            connectionsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "connection-empty",
                                children: "Đang tải danh sách..."
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 680,
                                columnNumber: 253
                            }, this) : connections.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "connections-list",
                                children: connections.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        className: "connection-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileLink, {
                                                ...profileLinkProps(user.username),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                        user: user,
                                                        size: "small"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/CommunityPages.jsx",
                                                        lineNumber: 680,
                                                        columnNumber: 499
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: user.fullName || user.username
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/CommunityPages.jsx",
                                                                lineNumber: 680,
                                                                columnNumber: 540
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                children: [
                                                                    "@",
                                                                    user.username
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/CommunityPages.jsx",
                                                                lineNumber: 680,
                                                                columnNumber: 589
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/CommunityPages.jsx",
                                                        lineNumber: 680,
                                                        columnNumber: 534
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 680,
                                                columnNumber: 449
                                            }, this),
                                            data.isOwnProfile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>manageConnection(user),
                                                children: connectionMode === 'following' ? 'Hủy theo dõi' : 'Xóa người theo dõi'
                                            }, void 0, false, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 680,
                                                columnNumber: 662
                                            }, this) : !user.isFollowing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>followFromConnections(user),
                                                children: "Theo dõi +"
                                            }, void 0, false, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 680,
                                                columnNumber: 828
                                            }, this)
                                        ]
                                    }, user.username, true, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 680,
                                        columnNumber: 393
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 680,
                                columnNumber: 334
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "connection-empty",
                                children: "Danh sách này hiện chưa có ai."
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 680,
                                columnNumber: 935
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 680,
                        columnNumber: 24
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "profile-posts-heading",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Bài viết"
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 681,
                                columnNumber: 44
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    data.posts.length,
                                    " chia sẻ"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 681,
                                columnNumber: 61
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 681,
                        columnNumber: 5
                    }, this),
                    data.posts.length ? data.posts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfilePost, {
                            post: post,
                            isOwner: data.isOwnProfile,
                            onChanged: ()=>setRefreshKey((value)=>value + 1)
                        }, post.id, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 682,
                            columnNumber: 49
                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "feed-empty",
                        children: "Chưa có bài viết nào."
                    }, void 0, false, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 682,
                        columnNumber: 174
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 669,
                columnNumber: 170
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/CommunityPages.jsx",
            lineNumber: 669,
            columnNumber: 51
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 669,
        columnNumber: 10
    }, this);
}
_s10(MemberProfileContent, "B35cIIrFElHc5D32pOWlyiBQ0Jk=");
_c15 = MemberProfileContent;
function MemberProfilePage() {
    _s11();
    const { username } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MemberProfileContent, {
        username: username,
        navigate: navigate
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 689,
        columnNumber: 10
    }, this);
}
_s11(MemberProfilePage, "0hYHwxfA6mGaY7shwpnqPy0cMLA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"]
    ];
});
_c16 = MemberProfilePage;
function NextMemberProfilePage() {
    _s12();
    const parameters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MemberProfileContent, {
        username: parameters.username,
        navigate: (path)=>router.push(path),
        Navigation: NextCommunityNav,
        useNextLinks: true
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 695,
        columnNumber: 10
    }, this);
}
_s12(NextMemberProfilePage, "7hXC55H6Y2gWJYYczyZwpeyN9g8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c17 = NextMemberProfilePage;
function AccountAvatarEditor({ form, setForm }) {
    _s13();
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const uploadAvatar = async (event)=>{
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Ảnh đại diện phải nhỏ hơn 5 MB.');
        const body = new FormData();
        body.append('file', file);
        setUploading(true);
        try {
            const response = await fetch(`${API}/account/avatar`, {
                method: 'POST',
                headers: authHeaders(),
                body
            });
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readApiResponse"])(response);
            if (!response.ok) throw new Error(data.message || 'Không thể cập nhật ảnh đại diện.');
            setForm((current)=>({
                    ...current,
                    avatarUrl: data.avatarUrl
                }));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(data.message);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        } finally{
            setUploading(false);
            event.target.value = '';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "avatar-upload-row",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                user: form,
                size: "large"
            }, void 0, false, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 716,
                columnNumber: 45
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "avatar-upload-button",
                        children: [
                            uploading ? 'Đang tải ảnh...' : 'Tải avatar lên',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                accept: "image/jpeg,image/png,image/webp,image/gif",
                                onChange: uploadAvatar,
                                disabled: uploading
                            }, void 0, false, {
                                fileName: "[project]/src/CommunityPages.jsx",
                                lineNumber: 716,
                                columnNumber: 175
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 716,
                        columnNumber: 85
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                        children: "JPG, PNG, WebP hoặc GIF · tối đa 5 MB"
                    }, void 0, false, {
                        fileName: "[project]/src/CommunityPages.jsx",
                        lineNumber: 716,
                        columnNumber: 300
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/CommunityPages.jsx",
                lineNumber: 716,
                columnNumber: 80
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 716,
        columnNumber: 10
    }, this);
}
_s13(AccountAvatarEditor, "7fSqO2OqLYyCuGUs/ZTqKghpSFk=");
_c18 = AccountAvatarEditor;
function AccountPage() {
    _s14();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        currentPassword: '',
        newPassword: ''
    });
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AccountPage.useEffect": ()=>{
            if (!token()) {
                navigate('/login');
                return;
            }
            apiRequest('/account/me').then({
                "AccountPage.useEffect": (user)=>{
                    setProfile(user);
                    setForm({
                        ...user,
                        birthDate: user.birthDate ? user.birthDate.slice(0, 10) : ''
                    });
                }
            }["AccountPage.useEffect"]).catch({
                "AccountPage.useEffect": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message)
            }["AccountPage.useEffect"]);
        }
    }["AccountPage.useEffect"], [
        navigate
    ]);
    const updateField = (event)=>setForm((current)=>({
                ...current,
                [event.target.name]: event.target.value
            }));
    const saveProfile = async (event)=>{
        event.preventDefault();
        setSaving(true);
        try {
            const updated = await apiRequest('/account/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    ...form,
                    birthDate: form.birthDate || null
                })
            });
            setProfile(updated);
            setForm({
                ...updated,
                birthDate: updated.birthDate ? updated.birthDate.slice(0, 10) : ''
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Hồ sơ đã được cập nhật.');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        } finally{
            setSaving(false);
        }
    };
    const changePassword = async (event)=>{
        event.preventDefault();
        try {
            const result = await apiRequest('/account/password', {
                method: 'PUT',
                body: JSON.stringify(password)
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(result.message);
            setPassword({
                currentPassword: '',
                newPassword: ''
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommunityLayout, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "community-main account-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "account-heading",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "community-kicker",
                            children: "TÀI KHOẢN CỦA BẠN"
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 740,
                            columnNumber: 109
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: "Cài đặt hồ sơ"
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 740,
                            columnNumber: 162
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Quản lý cách mọi người nhìn thấy bạn trong cộng đồng."
                        }, void 0, false, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 740,
                            columnNumber: 184
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 740,
                    columnNumber: 73
                }, this),
                profile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "account-grid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "account-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "account-section-head",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "section-index",
                                                children: "01"
                                            }, void 0, false, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 740,
                                                columnNumber: 375
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Thông tin cá nhân"
                                            }, void 0, false, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 740,
                                                columnNumber: 416
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/CommunityPages.jsx",
                                        lineNumber: 740,
                                        columnNumber: 370
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 740,
                                    columnNumber: 332
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AccountAvatarEditor, {
                                    form: form,
                                    setForm: setForm
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 740,
                                    columnNumber: 454
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: saveProfile,
                                    className: "account-form",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Họ và tên",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "fullName",
                                                    value: form.fullName || '',
                                                    onChange: updateField,
                                                    required: true,
                                                    maxLength: 120
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 740,
                                                    columnNumber: 577
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 561
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Username",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "username",
                                                    value: form.username || '',
                                                    onChange: updateField,
                                                    required: true,
                                                    maxLength: 40
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 740,
                                                    columnNumber: 701
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 686
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Email",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "email",
                                                    type: "email",
                                                    value: form.email || '',
                                                    onChange: updateField,
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 740,
                                                    columnNumber: 821
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 809
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Số điện thoại",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "phoneNumber",
                                                    type: "tel",
                                                    value: form.phoneNumber || '',
                                                    onChange: updateField
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 740,
                                                    columnNumber: 941
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 921
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Ngày sinh",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "birthDate",
                                                    type: "date",
                                                    value: form.birthDate || '',
                                                    onChange: updateField
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 740,
                                                    columnNumber: 1058
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 1042
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "full-field",
                                            children: [
                                                "Hoặc dán đường dẫn avatar",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "avatarUrl",
                                                    type: "url",
                                                    value: form.avatarUrl || '',
                                                    onChange: updateField,
                                                    placeholder: "https://..."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 740,
                                                    columnNumber: 1211
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 1156
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "full-field",
                                            children: [
                                                "Giới thiệu",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    name: "bio",
                                                    value: form.bio || '',
                                                    onChange: updateField,
                                                    rows: "3",
                                                    maxLength: 500,
                                                    placeholder: "Một chút về bạn và căn bếp của bạn..."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 740,
                                                    columnNumber: 1374
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 1334
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "account-form-actions",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                disabled: saving,
                                                children: [
                                                    saving ? 'Đang lưu...' : 'Lưu hồ sơ',
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "↗"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/CommunityPages.jsx",
                                                        lineNumber: 740,
                                                        columnNumber: 1645
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 740,
                                                columnNumber: 1566
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 1528
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 740,
                                    columnNumber: 507
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 740,
                            columnNumber: 295
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "account-section password-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "account-section-head",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "section-index",
                                                    children: "02"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 740,
                                                    columnNumber: 1788
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    children: "Bảo mật"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 740,
                                                    columnNumber: 1829
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 1783
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "security-mark",
                                            children: "✳"
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 1851
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 740,
                                    columnNumber: 1745
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "security-copy",
                                    children: "Dùng mật khẩu dài và riêng biệt để giữ tài khoản an toàn."
                                }, void 0, false, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 740,
                                    columnNumber: 1897
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: changePassword,
                                    className: "account-form",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Mật khẩu hiện tại",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "password",
                                                    value: password.currentPassword,
                                                    onChange: (event)=>setPassword((current)=>({
                                                                ...current,
                                                                currentPassword: event.target.value
                                                            })),
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 740,
                                                    columnNumber: 2068
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 2044
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Mật khẩu mới",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "password",
                                                    minLength: "8",
                                                    value: password.newPassword,
                                                    onChange: (event)=>setPassword((current)=>({
                                                                ...current,
                                                                newPassword: event.target.value
                                                            })),
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 740,
                                                    columnNumber: 2260
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: "Ít nhất 8 ký tự."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/CommunityPages.jsx",
                                                    lineNumber: 740,
                                                    columnNumber: 2431
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 2241
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "account-form-actions",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                children: [
                                                    "Đổi mật khẩu ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "↗"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/CommunityPages.jsx",
                                                        lineNumber: 740,
                                                        columnNumber: 2543
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/CommunityPages.jsx",
                                                lineNumber: 740,
                                                columnNumber: 2508
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/CommunityPages.jsx",
                                            lineNumber: 740,
                                            columnNumber: 2470
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/CommunityPages.jsx",
                                    lineNumber: 740,
                                    columnNumber: 1987
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/CommunityPages.jsx",
                            lineNumber: 740,
                            columnNumber: 1691
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/CommunityPages.jsx",
                    lineNumber: 740,
                    columnNumber: 265
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/CommunityPages.jsx",
            lineNumber: 740,
            columnNumber: 27
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/CommunityPages.jsx",
        lineNumber: 740,
        columnNumber: 10
    }, this);
}
_s14(AccountPage, "5E+IWhdnkxQLqW+wC6PHo/xqJEU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"]
    ];
});
_c19 = AccountPage;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19;
__turbopack_context__.k.register(_c, "Avatar");
__turbopack_context__.k.register(_c1, "CommunityNavContent");
__turbopack_context__.k.register(_c2, "CommunityNav");
__turbopack_context__.k.register(_c3, "NextCommunityNav");
__turbopack_context__.k.register(_c4, "CommunityLayout");
__turbopack_context__.k.register(_c5, "PostMedia");
__turbopack_context__.k.register(_c6, "FeedPost");
__turbopack_context__.k.register(_c7, "FeedPage");
__turbopack_context__.k.register(_c8, "ArticleContent");
__turbopack_context__.k.register(_c9, "ArticlePage");
__turbopack_context__.k.register(_c10, "NextArticlePage");
__turbopack_context__.k.register(_c11, "MembersDirectoryContent");
__turbopack_context__.k.register(_c12, "MembersPage");
__turbopack_context__.k.register(_c13, "NextMembersPage");
__turbopack_context__.k.register(_c14, "ProfilePost");
__turbopack_context__.k.register(_c15, "MemberProfileContent");
__turbopack_context__.k.register(_c16, "MemberProfilePage");
__turbopack_context__.k.register(_c17, "NextMemberProfilePage");
__turbopack_context__.k.register(_c18, "AccountAvatarEditor");
__turbopack_context__.k.register(_c19, "AccountPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_CommunityPages_jsx_1au8nre._.js.map