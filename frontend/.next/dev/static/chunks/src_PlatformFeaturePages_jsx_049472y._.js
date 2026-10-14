(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/PlatformFeaturePages.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AIAssistantPage",
    ()=>AIAssistantPage,
    "AuthorProfilePage",
    ()=>AuthorProfilePage,
    "ChallengesPage",
    ()=>ChallengesPage,
    "CookModePage",
    ()=>CookModePage,
    "CookTogetherPage",
    ()=>CookTogetherPage,
    "CookbookShelfPage",
    ()=>CookbookShelfPage,
    "CreatorDashboardPage",
    ()=>CreatorDashboardPage,
    "DraftsPage",
    ()=>DraftsPage,
    "EditorPicksPage",
    ()=>EditorPicksPage,
    "FlexibleRecipePage",
    ()=>FlexibleRecipePage,
    "FridgeMatchPage",
    ()=>FridgeMatchPage,
    "MealPlannerPage",
    ()=>MealPlannerPage,
    "MultilingualPage",
    ()=>MultilingualPage,
    "NextChallengesPage",
    ()=>NextChallengesPage,
    "NextCreatorDashboardPage",
    ()=>NextCreatorDashboardPage,
    "NotificationsPage",
    ()=>NotificationsPage,
    "PrintExportPage",
    ()=>PrintExportPage,
    "RecipeEngagement",
    ()=>RecipeEngagement,
    "RecipeJournalPage",
    ()=>RecipeJournalPage,
    "RecipeQnaPage",
    ()=>RecipeQnaPage,
    "SafetyPage",
    ()=>SafetyPage,
    "SavedRecipesPage",
    ()=>SavedRecipesPage,
    "SeasonalChallengePage",
    ()=>SeasonalChallengePage,
    "StandardRecipePage",
    ()=>StandardRecipePage,
    "TasteSuggestionPage",
    ()=>TasteSuggestionPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-router/dist/development/chunk-OB3PAWPO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/LocaleContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/config.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/CommunityPages.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature(), _s12 = __turbopack_context__.k.signature(), _s13 = __turbopack_context__.k.signature(), _s14 = __turbopack_context__.k.signature(), _s15 = __turbopack_context__.k.signature(), _s16 = __turbopack_context__.k.signature(), _s17 = __turbopack_context__.k.signature(), _s18 = __turbopack_context__.k.signature(), _s19 = __turbopack_context__.k.signature(), _s20 = __turbopack_context__.k.signature(), _s21 = __turbopack_context__.k.signature(), _s22 = __turbopack_context__.k.signature(), _s23 = __turbopack_context__.k.signature(), _s24 = __turbopack_context__.k.signature();
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
const API = API_V1;
const getToken = ()=>localStorage.getItem('accessToken') || '';
const headers = (json = false)=>({
        ...json ? {
            'Content-Type': 'application/json'
        } : {},
        ...getToken() ? {
            Authorization: `Bearer ${getToken()}`
        } : {}
    });
async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
        ...options,
        headers: {
            ...headers(Boolean(options.body)),
            ...options.headers
        }
    });
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readApiResponse"])(response);
    if (!response.ok) throw new Error(data.message || 'Không thể hoàn thành yêu cầu.');
    return data;
}
function FeatureShell({ eyebrow, title, intro, children, Navigation = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommunityNav"] }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "community-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Navigation, {}, void 0, false, {
                fileName: "[project]/src/PlatformFeaturePages.jsx",
                lineNumber: 25,
                columnNumber: 41
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "community-main feature-page",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "feature-heading",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "community-kicker",
                                children: t(eyebrow)
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 25,
                                columnNumber: 137
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: t(title)
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 25,
                                columnNumber: 185
                            }, this),
                            intro && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: t(intro)
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 25,
                                columnNumber: 214
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 25,
                        columnNumber: 101
                    }, this),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/src/PlatformFeaturePages.jsx",
                lineNumber: 25,
                columnNumber: 55
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 25,
        columnNumber: 10
    }, this);
}
_s(FeatureShell, "XHTLWhiyaNJXAkpx8ws1crwFino=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c = FeatureShell;
function formatCountdown(totalSeconds) {
    const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
    const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, '0');
    const seconds = String(safeSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}
function FridgeMatchPage() {
    _s1();
    const { settings, t, normalizeInput } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const [inventory, setInventory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FridgeMatchPage.useState": ()=>settings.language === 'en' ? 'egg, onion, tomato, noodles, MSG, garlic, tofu' : 'trứng, hành tây, cà chua, mì, bột ngọt, tỏi, đậu phụ'
    }["FridgeMatchPage.useState"]);
    const recipeCatalog = [
        {
            id: 1,
            title: 'Mì xào rau củ chay',
            ingredients: [
                'mì',
                'đậu phụ',
                'hành tây',
                'tỏi',
                'cà chua',
                'bột ngọt'
            ],
            missing: [
                'ớt chuông',
                'nước tương'
            ]
        },
        {
            id: 2,
            title: 'Canh chua cá',
            ingredients: [
                'cá',
                'dứa',
                'hành tây',
                'cà chua',
                'ngò'
            ],
            missing: [
                'đậu bắp',
                'giấm'
            ]
        },
        {
            id: 3,
            title: 'Bánh tráng trộn',
            ingredients: [
                'bánh tráng',
                'trứng',
                'hành tây',
                'tỏi',
                'cà chua'
            ],
            missing: [
                'đồ chua',
                'mè rang'
            ]
        },
        {
            id: 4,
            title: 'Gỏi đậu phụ',
            ingredients: [
                'đậu phụ',
                'hành tây',
                'tỏi',
                'cà chua'
            ],
            missing: [
                'rau thơm',
                'dưa leo'
            ]
        }
    ];
    const currentInventory = inventory.split(',').map(normalizeInput).filter(Boolean);
    const suggestions = recipeCatalog.map((recipe)=>{
        const matched = recipe.ingredients.filter((item)=>currentInventory.includes(item));
        const missing = recipe.ingredients.filter((item)=>!currentInventory.includes(item));
        return {
            ...recipe,
            matched,
            missing,
            score: matched.length
        };
    }).filter((item)=>item.score > 0).sort((a, b)=>b.score - a.score);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "TỦ LẠNH CÒN GÌ?",
        title: "Gợi ý món theo nguyên liệu",
        intro: "Nhập những gì bạn đang có trong tủ lạnh hoặc tủ đồ, hệ thống sẽ đề xuất món phù hợp và chỉ ra thứ còn thiếu.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-columns fridge-columns",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: t('Nguyên liệu đang có')
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: inventory,
                            onChange: (event)=>setInventory(event.target.value),
                            className: "fridge-textarea",
                            placeholder: t('Ví dụ: trứng, hành tây, cà chua, mì, bột ngọt, tỏi')
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fridge-summary",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: currentInventory.length
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: t('mặt hàng đang có')
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: t('Đề xuất món ăn')
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this),
                        suggestions.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fridge-list",
                            children: suggestions.map((recipe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    className: "fridge-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "fridge-card-top",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    children: t(recipe.title)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 95,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        recipe.score,
                                                        "/",
                                                        recipe.ingredients.length,
                                                        " ",
                                                        t('số nguyên liệu')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 96,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 94,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: t('Đã có:')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 98,
                                                    columnNumber: 22
                                                }, this),
                                                " ",
                                                recipe.matched.length ? recipe.matched.map(t).join(', ') : t('Không có nguyên liệu nào trùng')
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 98,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: t('Còn thiếu:')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 99,
                                                    columnNumber: 22
                                                }, this),
                                                " ",
                                                recipe.missing.length ? recipe.missing.map(t).join(', ') : t('Bạn đã có đủ nguyên liệu')
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 99,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, recipe.id, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 93,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "feature-empty",
                            children: t('Chưa có món nào phù hợp. Hãy thêm ít nguyên liệu vào tủ lạnh để nhận đề xuất.')
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 104,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 66,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_s1(FridgeMatchPage, "5yLedlAom9FsVL/z4x+iePvEziM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c1 = FridgeMatchPage;
function FlexibleRecipePage() {
    _s2();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const [servings, setServings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(2);
    const [savedPortion, setSavedPortion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(2);
    const recipe = {
        title: 'Bún chả giò rau củ',
        baseServings: 2,
        ingredients: [
            {
                name: 'Bún',
                amount: 200,
                unit: 'g'
            },
            {
                name: 'Giò chả',
                amount: 150,
                unit: 'g'
            },
            {
                name: 'Rau sống',
                amount: 80,
                unit: 'g'
            },
            {
                name: 'Nước chấm',
                amount: 50,
                unit: 'ml'
            },
            {
                name: 'Tỏi',
                amount: 3,
                unit: 'cây'
            }
        ]
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FlexibleRecipePage.useEffect": ()=>{
            const stored = Number(localStorage.getItem('recipePortionPreference') || '2');
            if (!Number.isNaN(stored) && stored > 0) {
                setSavedPortion(stored);
                setServings(stored);
            }
        }
    }["FlexibleRecipePage.useEffect"], []);
    const scaleFactor = servings / recipe.baseServings;
    const savePreference = ()=>{
        localStorage.setItem('recipePortionPreference', String(servings));
        setSavedPortion(servings);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã lưu khẩu phần ${servings} người.`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "CÔNG THỨC LINH HOẠT",
        title: "Tự quy đổi khẩu phần",
        intro: "Tăng giảm khẩu phần và chỉnh lượng nguyên liệu theo tỷ lệ thực tế, rồi lưu lựa chọn riêng cho lần nấu tiếp theo.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "feature-section flexible-section",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flexible-top",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "community-kicker",
                                    children: t('Món hiện tại')
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: t(recipe.title)
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "serving-control",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "feature-button",
                                    onClick: ()=>setServings((value)=>Math.max(1, value - 1)),
                                    children: "−"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    min: "1",
                                    max: "20",
                                    value: servings,
                                    onChange: (event)=>setServings(Math.max(1, Number(event.target.value) || 1))
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "feature-button",
                                    onClick: ()=>setServings((value)=>Math.min(20, value + 1)),
                                    children: "+"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flexible-actions",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "feature-button primary",
                            onClick: savePreference,
                            children: "Lưu khẩu phần"
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                t('Đã lưu:'),
                                " ",
                                savedPortion,
                                " ",
                                t('người')
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 159,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "ingredient-scale-table",
                    children: recipe.ingredients.map((ingredient)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ingredient-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: t(ingredient.name)
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 167,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: [
                                        (ingredient.amount * scaleFactor).toFixed(ingredient.amount % 1 === 0 ? 0 : 1),
                                        " ",
                                        ingredient.unit
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, ingredient.name, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 166,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 164,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 146,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 145,
        columnNumber: 5
    }, this);
}
_s2(FlexibleRecipePage, "A/O+ojt4FfQdhQw8nqc8aKj60YI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c2 = FlexibleRecipePage;
function RecipeJournalPage() {
    _s3();
    const initialEntries = [
        {
            id: 1,
            title: 'Mì xào rau củ chay',
            note: 'Thêm 1 thìa nước tương để đậm hơn',
            spice: 'Tăng chút ớt',
            cookedAt: '2026-09-28',
            duration: 22,
            result: 'Mềm, thơm, rất hợp với bàn ăn gia đình'
        },
        {
            id: 2,
            title: 'Canh chua cá',
            note: 'Giảm dứa đi một ít vì gia đình không thích chua quá',
            spice: 'Bớt ớt',
            cookedAt: '2026-09-25',
            duration: 35,
            result: 'Nước canh ngon nhưng cần thêm chút muối.'
        }
    ];
    const [entries, setEntries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialEntries);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        note: '',
        spice: '',
        cookedAt: new Date().toISOString().slice(0, 10),
        duration: 30,
        result: ''
    });
    const handleSubmit = (event)=>{
        event.preventDefault();
        if (!form.title.trim()) return;
        setEntries((current)=>[
                {
                    id: Date.now(),
                    title: form.title,
                    note: form.note,
                    spice: form.spice,
                    cookedAt: form.cookedAt,
                    duration: Number(form.duration) || 0,
                    result: form.result
                },
                ...current
            ]);
        setForm({
            title: '',
            note: '',
            spice: '',
            cookedAt: new Date().toISOString().slice(0, 10),
            duration: 30,
            result: ''
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã lưu nhật ký nấu ăn.');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "NHẬT KÝ NẤU RIÊNG",
        title: "Ghi chép món đã thử",
        intro: "Lưu lại nguyên liệu, thay đổi gia vị, thời gian nấu và cảm nhận thực tế để mỗi lần nấu dần tốt hơn.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-columns journal-columns",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Thêm ghi chú nấu"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 209,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 208,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "journal-form",
                            onSubmit: handleSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Tên món",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: form.title,
                                            onChange: (event)=>setForm({
                                                    ...form,
                                                    title: event.target.value
                                                }),
                                            placeholder: "Ví dụ: Bò băm xào rau"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 215,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 213,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Ghi chú",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: form.note,
                                            onChange: (event)=>setForm({
                                                    ...form,
                                                    note: event.target.value
                                                }),
                                            placeholder: "Bạn đã thay đổi gì?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 219,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Thay đổi gia vị",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: form.spice,
                                            onChange: (event)=>setForm({
                                                    ...form,
                                                    spice: event.target.value
                                                }),
                                            placeholder: "Ví dụ: bớt cay, thêm tỏi"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 223,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 221,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "journal-inline-fields",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Ngày nấu",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    value: form.cookedAt,
                                                    onChange: (event)=>setForm({
                                                            ...form,
                                                            cookedAt: event.target.value
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 228,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 226,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Thời gian (phút)",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    min: "1",
                                                    value: form.duration,
                                                    onChange: (event)=>setForm({
                                                            ...form,
                                                            duration: event.target.value
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 232,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 230,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 225,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Kết quả",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: form.result,
                                            onChange: (event)=>setForm({
                                                    ...form,
                                                    result: event.target.value
                                                }),
                                            placeholder: "Món có ngon không, ai thích ăn gì?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 237,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 235,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "feature-button primary",
                                    children: "Lưu nhật ký"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 212,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 207,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Lịch sử nấu"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 245,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "journal-list",
                            children: entries.map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    className: "journal-entry",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "journal-entry-header",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: entry.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 252,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: entry.cookedAt
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 253,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 251,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Ghi chú:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 255,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                entry.note || 'Không có ghi chú'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 255,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Gia vị:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 256,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                entry.spice || 'Không đổi'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 256,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Thời gian:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 257,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                entry.duration,
                                                " phút"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 257,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Kết quả:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 258,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                entry.result || 'Chưa ghi kết quả'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 258,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, entry.id, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 250,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 248,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 243,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 206,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 205,
        columnNumber: 5
    }, this);
}
_s3(RecipeJournalPage, "jyNNm6dEBKzVf8JngXWX+SDOpJM=");
_c3 = RecipeJournalPage;
function RecipeQnaPage() {
    _s4();
    const [selectedRecipe, setSelectedRecipe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Mì xào rau củ chay');
    const [question, setQuestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: 1,
            recipe: 'Mì xào rau củ chay',
            author: 'Lan',
            text: 'Mì có bị dính nếu để lâu không?',
            answer: 'Để mì quay lại chảo cùng chút dầu, đảo đều để tránh dính và giữ nhiệt vừa phải.',
            pinned: true,
            answeredBy: 'Hương'
        },
        {
            id: 2,
            recipe: 'Canh chua cá',
            author: 'Minh',
            text: 'Nên cho dứa khi nào để không bị quá chua?',
            answer: 'Cho dứa sau khi cá vừa chín, giữ lửa vừa để vị chua không mất đi.',
            pinned: false,
            answeredBy: 'Bé'
        },
        {
            id: 3,
            recipe: 'Gỏi đậu phụ',
            author: 'An',
            text: 'Có thể thay đậu phụ bằng đậu hũ chiên không?',
            answer: 'Có, nhưng nên chiên nhẹ để giữ độ giòn và không quá bám.',
            pinned: true,
            answeredBy: 'Chef Bông'
        }
    ]);
    const recipes = [
        'Mì xào rau củ chay',
        'Canh chua cá',
        'Gỏi đậu phụ',
        'Bún chả giò rau củ'
    ];
    const filtered = questions.filter((item)=>item.recipe === selectedRecipe);
    const handleSubmit = (event)=>{
        event.preventDefault();
        if (!question.trim()) return;
        setQuestions((current)=>[
                {
                    id: Date.now(),
                    recipe: selectedRecipe,
                    author: 'Bạn',
                    text: question,
                    answer: '',
                    pinned: false,
                    answeredBy: ''
                },
                ...current
            ]);
        setQuestion('');
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Câu hỏi đã được gửi để cộng đồng trả lời.');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "HỎI ĐÁP THEO CÔNG THỨC",
        title: "Cộng đồng trả lời bạn",
        intro: "Hỏi về nguyên liệu, kỹ thuật nấu, hoặc cách thay thế để cải thiện món ăn của bạn.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-columns qna-columns",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Đặt câu hỏi"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 302,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 301,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "qna-form",
                            onSubmit: handleSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Chọn công thức",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: selectedRecipe,
                                            onChange: (event)=>setSelectedRecipe(event.target.value),
                                            children: recipes.map((recipe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: recipe,
                                                    children: recipe
                                                }, recipe, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 309,
                                                    columnNumber: 42
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 308,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 306,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Câu hỏi của bạn",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: question,
                                            onChange: (event)=>setQuestion(event.target.value),
                                            placeholder: "Ví dụ: Mì nên xào lúc nào để vừa mềm vừa thơm?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 314,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 312,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "feature-button primary",
                                    children: "Gửi câu hỏi"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 305,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 300,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Trả lời hữu ích"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 322,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 321,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "qna-list",
                            children: filtered.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    className: item.pinned ? 'qna-card pinned' : 'qna-card',
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "qna-card-top",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: item.author
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 329,
                                                    columnNumber: 19
                                                }, this),
                                                item.pinned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Ghim"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 330,
                                                    columnNumber: 35
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 328,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: item.text
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 332,
                                            columnNumber: 17
                                        }, this),
                                        item.answer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "qna-answer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: item.answeredBy
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 335,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: item.answer
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 336,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 334,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "qna-waiting",
                                            children: "Đang chờ cộng đồng trả lời..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 339,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.id, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 327,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 325,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 320,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 299,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 298,
        columnNumber: 5
    }, this);
}
_s4(RecipeQnaPage, "VJJOAcZuNrxDEQhtsGTNC7tcYMU=");
_c4 = RecipeQnaPage;
function CookTogetherPage() {
    _s5();
    const [sessions, setSessions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: 1,
            title: 'Nấu mì xào kiểu nhà',
            host: 'Hà',
            time: '2026-09-30T19:00',
            duration: 45,
            slots: 6,
            joined: 4
        },
        {
            id: 2,
            title: 'Chảo nóng món chay',
            host: 'Bé',
            time: '2026-10-01T18:30',
            duration: 60,
            slots: 8,
            joined: 5
        }
    ]);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        time: '',
        duration: 45,
        slots: 6
    });
    const handleSubmit = (event)=>{
        event.preventDefault();
        if (!form.title.trim() || !form.time) return;
        setSessions((current)=>[
                {
                    id: Date.now(),
                    title: form.title,
                    host: 'Bạn',
                    time: form.time,
                    duration: Number(form.duration) || 45,
                    slots: Number(form.slots) || 6,
                    joined: 1
                },
                ...current
            ]);
        setForm({
            title: '',
            time: '',
            duration: 45,
            slots: 6
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Buổi nấu chung đã được tạo.');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "NẤU CÙNG NHAU TRỰC TUYẾN",
        title: "Tạo buổi nấu chung",
        intro: "Mời bạn bè cùng nấu, theo dõi tiến độ và trò chuyện trong một buổi nấu diễn ra theo lịch.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-columns cook-together-columns",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Thiết lập buổi mới"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 380,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 379,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "cook-together-form",
                            onSubmit: handleSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Tên buổi nấu",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: form.title,
                                            onChange: (event)=>setForm({
                                                    ...form,
                                                    title: event.target.value
                                                }),
                                            placeholder: "Ví dụ: Nấu bún chả cuối tuần"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 386,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 384,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Thời gian bắt đầu",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "datetime-local",
                                            value: form.time,
                                            onChange: (event)=>setForm({
                                                    ...form,
                                                    time: event.target.value
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 390,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 388,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cook-together-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Thời lượng (phút)",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    min: "15",
                                                    value: form.duration,
                                                    onChange: (event)=>setForm({
                                                            ...form,
                                                            duration: event.target.value
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 395,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 393,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Sức chứa",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    min: "2",
                                                    value: form.slots,
                                                    onChange: (event)=>setForm({
                                                            ...form,
                                                            slots: event.target.value
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 399,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 397,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 392,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "feature-button primary",
                                    children: "Tạo buổi nấu"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 402,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 383,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 378,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Buổi đang diễn ra"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 408,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 407,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cook-together-list",
                            children: sessions.map((session)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    className: "cook-together-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "cook-together-header",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: session.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 415,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        session.joined,
                                                        "/",
                                                        session.slots,
                                                        " người"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 416,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 414,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                "Chủ trì: ",
                                                session.host
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 418,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: new Date(session.time).toLocaleString('vi-VN')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 419,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "cook-together-footer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: [
                                                        session.duration,
                                                        " phút"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 421,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    className: "feature-button",
                                                    children: "Tham gia"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 422,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 420,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, session.id, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 413,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 411,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 406,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 377,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 376,
        columnNumber: 5
    }, this);
}
_s5(CookTogetherPage, "hsMKyS5KYvN4+T0LlMa03W2/pQA=");
_c5 = CookTogetherPage;
function CookbookShelfPage() {
    _s6();
    const [collections, setCollections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: 1,
            name: 'Gia đình',
            owner: 'Bạn',
            recipes: [
                'Mì xào rau củ chay',
                'Canh chua cá',
                'Bánh tráng trộn'
            ],
            shared: true
        },
        {
            id: 2,
            name: 'Món chay nhanh',
            owner: 'Hương',
            recipes: [
                'Gỏi đậu phụ',
                'Nộm hoa chuối',
                'Bún chả giò rau củ'
            ],
            shared: true
        },
        {
            id: 3,
            name: 'Công thức lớp học',
            owner: 'Bé',
            recipes: [
                'Bánh bột khoai',
                'Canh bí đỏ'
            ],
            shared: false
        }
    ]);
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedRecipe, setSelectedRecipe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Mì xào rau củ chay');
    const addCollection = (event)=>{
        event.preventDefault();
        if (!name.trim()) return;
        setCollections((current)=>[
                {
                    id: Date.now(),
                    name: name.trim(),
                    owner: 'Bạn',
                    recipes: [
                        selectedRecipe
                    ],
                    shared: true
                },
                ...current
            ]);
        setName('');
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Bộ sưu tập đã được tạo.');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "SỔ TAY CÔNG THỨC CHUNG",
        title: "Bộ sưu tập riêng & chia sẻ",
        intro: "Tạo và chia sẻ tuyển tập món ăn với gia đình, bạn bè hoặc nhóm nấu cùng nhau.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-columns cookbook-columns",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Tạo bộ sưu tập"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 463,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 462,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "cookbook-form",
                            onSubmit: addCollection,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Tên bộ sưu tập",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: name,
                                            onChange: (event)=>setName(event.target.value),
                                            placeholder: "Ví dụ: Món ăn cuối tuần"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 469,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 467,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        "Thêm món đầu tiên",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: selectedRecipe,
                                            onChange: (event)=>setSelectedRecipe(event.target.value),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "Mì xào rau củ chay",
                                                    children: "Mì xào rau củ chay"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 474,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "Canh chua cá",
                                                    children: "Canh chua cá"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 475,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "Bún chả giò rau củ",
                                                    children: "Bún chả giò rau củ"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 476,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "Gỏi đậu phụ",
                                                    children: "Gỏi đậu phụ"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 477,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 473,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 471,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "feature-button primary",
                                    children: "Tạo sổ tay"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 480,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 466,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 461,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Danh sách bộ sưu tập"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 486,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 485,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cookbook-list",
                            children: collections.map((collection)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    className: "cookbook-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "cookbook-card-top",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: collection.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 493,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: collection.shared ? 'Chia sẻ' : 'Riêng tư'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 494,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 492,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                            children: [
                                                "Người tạo: ",
                                                collection.owner
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 496,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            children: collection.recipes.map((recipe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: recipe
                                                }, `${collection.id}-${recipe}`, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 498,
                                                    columnNumber: 55
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 497,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, collection.id, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 491,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 489,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 484,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 460,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 459,
        columnNumber: 5
    }, this);
}
_s6(CookbookShelfPage, "wClW4Ef6gQXneo32NgRst8Pdq2w=");
_c6 = CookbookShelfPage;
function TasteSuggestionPage() {
    _s7();
    const [preferences, setPreferences] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        vegetarian: false,
        spicy: false,
        quick: false,
        budget: false,
        allergy: 'Không'
    });
    const suggestions = [
        {
            title: 'Mì xào rau củ chay',
            tags: [
                'món chay',
                'nhanh',
                'tiết kiệm'
            ],
            score: 100
        },
        {
            title: 'Gỏi đậu phụ',
            tags: [
                'món chay',
                'mát',
                'nhanh'
            ],
            score: 92
        },
        {
            title: 'Canh chua cá',
            tags: [
                'cay nhẹ',
                'gia đình'
            ],
            score: 85
        },
        {
            title: 'Bún chả giò rau củ',
            tags: [
                'đồ ăn nhanh',
                'dễ làm'
            ],
            score: 80
        }
    ].filter((recipe)=>{
        if (preferences.vegetarian && !recipe.tags.includes('món chay')) return false;
        if (preferences.spicy && !recipe.tags.some((tag)=>tag.includes('cay'))) return false;
        if (preferences.quick && !recipe.tags.includes('nhanh')) return false;
        if (preferences.budget && !recipe.tags.includes('tiết kiệm')) return false;
        if (preferences.allergy !== 'Không' && recipe.title.toLowerCase().includes('cá') && preferences.allergy === 'Cá') return false;
        return true;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "GỢI Ý THEO KHẨU VỊ",
        title: "Bảng tin cá nhân hóa",
        intro: "Chọn chế độ ăn, mức độ cay, độ nhanh, chi phí và yếu tố hạn chế để nhận món phù hợp với bạn.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-columns taste-columns",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Ưu tiên của bạn"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 531,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 530,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "taste-options",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: preferences.vegetarian,
                                            onChange: (event)=>setPreferences({
                                                    ...preferences,
                                                    vegetarian: event.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 535,
                                            columnNumber: 20
                                        }, this),
                                        " Món chay"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 535,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: preferences.spicy,
                                            onChange: (event)=>setPreferences({
                                                    ...preferences,
                                                    spicy: event.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 536,
                                            columnNumber: 20
                                        }, this),
                                        " Cay"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 536,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: preferences.quick,
                                            onChange: (event)=>setPreferences({
                                                    ...preferences,
                                                    quick: event.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 537,
                                            columnNumber: 20
                                        }, this),
                                        " Nhanh"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 537,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: preferences.budget,
                                            onChange: (event)=>setPreferences({
                                                    ...preferences,
                                                    budget: event.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 538,
                                            columnNumber: 20
                                        }, this),
                                        " Tiết kiệm"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 538,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 534,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "taste-select",
                            children: [
                                "Dị ứng / hạn chế",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: preferences.allergy,
                                    onChange: (event)=>setPreferences({
                                            ...preferences,
                                            allergy: event.target.value
                                        }),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "Không"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 544,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "Đậu phụ"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 545,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "Cá"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 546,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "Đậu nành"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 547,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 543,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 541,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 529,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Gợi ý phù hợp"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 554,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 553,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "taste-list",
                            children: suggestions.length ? suggestions.map((recipe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    className: "taste-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "taste-card-top",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: recipe.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 561,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        recipe.score,
                                                        "% phù hợp"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 562,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 560,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: recipe.tags.join(' • ')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 564,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, recipe.title, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 559,
                                    columnNumber: 15
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "feature-empty",
                                children: "Không có món phù hợp với bộ lọc hiện tại. Hãy thử đổi tiêu chí khác."
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 566,
                                columnNumber: 18
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 557,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 552,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 528,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 527,
        columnNumber: 5
    }, this);
}
_s7(TasteSuggestionPage, "5RW3dO0lH6he4ERBnX7Q4ByoRK0=");
_c7 = TasteSuggestionPage;
function SeasonalChallengePage() {
    _s8();
    const challenges = [
        {
            id: 1,
            season: 'Mùa thu',
            title: 'Bữa tối ấm áp',
            description: 'Chia sẻ món ăn có hương vị ấm áp, dễ nấu và phù hợp cho những ngày se lạnh.',
            progress: 72,
            status: 'Đã đăng ký'
        },
        {
            id: 2,
            season: 'Mùa hè',
            title: 'Món mát yêu thích',
            description: 'Góp phần xây dựng thực đơn mát lạnh, thanh nhẹ và dễ uống cho ngày nắng.',
            progress: 48,
            status: 'Đang thử'
        },
        {
            id: 3,
            season: 'Mùa đông',
            title: 'Bữa ăn giữ ấm',
            description: 'Tạo món ăn đậm đà, nhiều dinh dưỡng và giúp cả nhà quây quần bên bếp.',
            progress: 34,
            status: 'Chưa bắt đầu'
        }
    ];
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Mùa thu');
    const selectedChallenge = challenges.find((challenge)=>challenge.season === selected) || challenges[0];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "THỬ THÁCH THEO MÙA",
        title: "Bếp theo mùa, ăn theo thời tiết",
        intro: "Tham gia thử thách theo mùa để thử món mới, lưu lại thành tích và khích lệ cộng đồng sáng tạo.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-columns seasonal-columns",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Thử thách hiện có"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 589,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 588,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "challenge-list",
                            children: challenges.map((challenge)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: selectedChallenge.id === challenge.id ? 'challenge-selector active' : 'challenge-selector',
                                    onClick: ()=>setSelected(challenge.season),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: challenge.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 595,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: challenge.season
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 596,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, challenge.id, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 594,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 592,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 587,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: selectedChallenge.title
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 604,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: selectedChallenge.status
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 605,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 603,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "challenge-detail",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: selectedChallenge.description
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 609,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "challenge-progress-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: [
                                                selectedChallenge.progress,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 611,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "đã hoàn thành"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 612,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 610,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "challenge-meter",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            width: `${selectedChallenge.progress}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 615,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 614,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "challenge-badges",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "🏆 Cộng đồng"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 618,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "🍲 Dinh dưỡng"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 619,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "🌿 Tươi mới"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 620,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 617,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 608,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 602,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 586,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 585,
        columnNumber: 5
    }, this);
}
_s8(SeasonalChallengePage, "sGwgchL+rBDfzbeG7GYOZmGjh64=");
_c8 = SeasonalChallengePage;
function StandardRecipePage() {
    _s9();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const recipe = {
        title: 'Canh chua cá',
        summary: 'Món canh chua thanh ngọt, giàu hương vị và chuẩn bị nhanh cho bữa cơm gia đình.',
        prep: 20,
        cook: 25,
        difficulty: 'Trung bình',
        servings: 4,
        tools: [
            'Nồi',
            'Dao',
            'Thớt',
            'Muôi'
        ],
        allergens: [
            'Cá',
            'Hạt tiêu'
        ],
        substitutions: [
            'Thay cá bằng tôm',
            'Dùng dứa tươi hoặc dứa đóng hộp'
        ],
        nutrition: [
            'Protein: 24g',
            'Vitamin C: 16%',
            'Calorie: 285 kcal / khẩu phần'
        ],
        ingredients: [
            '500g cá basa',
            '200g dứa',
            '1 trái cà chua',
            '1 củ hành tây',
            '2 nhánh ngò',
            '1 lít nước',
            '1 muỗng canh giấm'
        ]
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "TRANG CÔNG THỨC CHUẨN QUỐC TẾ",
        title: "Recipe standard layout",
        intro: "Giao diện chuẩn cho một công thức chuyên nghiệp với thời gian, khẩu phần, nguyên liệu, độ khó, thay thế và thông tin dinh dưỡng.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-columns standard-columns",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: t(recipe.title)
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 658,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: t(recipe.difficulty)
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 659,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 657,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "standard-summary",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: t(recipe.summary)
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 663,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "attribute-grid",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: t('Chuẩn bị')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 665,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: [
                                                        recipe.prep,
                                                        " ",
                                                        t('phút')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 665,
                                                    columnNumber: 50
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 665,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: t('Nấu')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 666,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: [
                                                        recipe.cook,
                                                        " ",
                                                        t('phút')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 666,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 666,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: t('Khẩu phần')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 667,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: [
                                                        recipe.servings,
                                                        " ",
                                                        t('người')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 667,
                                                    columnNumber: 51
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 667,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: t('Độ khó')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 668,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: t(recipe.difficulty)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 668,
                                                    columnNumber: 48
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 668,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 664,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 662,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 656,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: t('Thông tin nhanh')
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 675,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 674,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "attribute-list",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: t('Dụng cụ')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 679,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: recipe.tools.map(t).join(' • ')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 679,
                                            columnNumber: 44
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 679,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: t('Nguyên liệu')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 680,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: recipe.ingredients.map(t).join(' • ')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 680,
                                            columnNumber: 48
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 680,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: t('Dị ứng')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 681,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: recipe.allergens.map(t).join(' • ')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 681,
                                            columnNumber: 43
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 681,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: t('Thay thế')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 682,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: recipe.substitutions.map(t).join(' • ')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 682,
                                            columnNumber: 45
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 682,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: t('Dinh dưỡng')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 683,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: recipe.nutrition.map(t).join(' • ')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 683,
                                            columnNumber: 47
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 683,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 678,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 673,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 655,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 654,
        columnNumber: 5
    }, this);
}
_s9(StandardRecipePage, "XHTLWhiyaNJXAkpx8ws1crwFino=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c9 = StandardRecipePage;
function EditorPicksPage() {
    const features = [
        {
            id: 1,
            title: 'Bí quyết nấu canh chua đúng vị',
            author: 'Chef Hương',
            type: 'Hướng dẫn',
            description: 'Cách điều chỉnh độ chua, độ ngọt và thời gian nấu để canh chua luôn giữ hương vị tự nhiên.'
        },
        {
            id: 2,
            title: '7 món ăn từ nguyên liệu còn lại trong tủ lạnh',
            author: 'Biên tập Bếp Nhà',
            type: 'Tự làm',
            description: 'Một bản tổng hợp nhanh để biến những nguyên liệu còn sót thành bữa ăn ngon và tiết kiệm.'
        },
        {
            id: 3,
            title: 'Mẹo sắp xếp bữa ăn theo mùa',
            author: 'Lê Mai',
            type: 'Chuyên đề',
            description: 'Phối hợp thực đơn theo mùa, dựa trên giá cả và khẩu vị của cả gia đình.'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "BIÊN TẬP NỔI BẬT",
        title: "Khám phá món ăn được chọn lọc",
        intro: "Những bài viết, mẹo nấu và chuyên đề được biên tập để khơi gợi cảm hứng mỗi ngày.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "editor-grid",
            children: features.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    className: "editor-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                            children: item.type
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 703,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: item.title
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 704,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: item.description
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 705,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "By ",
                                item.author
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 706,
                            columnNumber: 13
                        }, this)
                    ]
                }, item.id, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 702,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 700,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 699,
        columnNumber: 5
    }, this);
}
_c10 = EditorPicksPage;
function AuthorProfilePage() {
    const author = {
        name: 'Hương Nhi',
        role: 'Tác giả ẩm thực',
        bio: 'Yêu thích sáng tạo món ăn đơn giản, lành mạnh và có hương vị đậm chất gia đình.',
        stats: [
            {
                label: 'Công thức',
                value: '148'
            },
            {
                label: 'Người theo dõi',
                value: '31.2K'
            },
            {
                label: 'Mùa gặt',
                value: '14'
            }
        ],
        recipes: [
            'Mì xào rau củ chay',
            'Canh chua cá',
            'Gỏi đậu phụ',
            'Bánh tráng trộn'
        ]
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "HỒ SƠ TÁC GIẢ",
        title: "Trang cá nhân chuyên nghiệp",
        intro: "Trình bày hồ sơ tác giả, dòng thời gian công thức, thành tích và các món nổi bật đã chia sẻ.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "feature-section author-shell",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "author-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "author-badge",
                            children: "HN"
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 731,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "community-kicker",
                                    children: "TÁC GIẢ CHUYÊN NGHIỆP"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 733,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: author.name
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 734,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                    children: author.role
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 735,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 732,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 730,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "author-bio",
                    children: author.bio
                }, void 0, false, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 739,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "author-stats",
                    children: author.stats.map((stat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "author-stat",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: stat.value
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 744,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: stat.label
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 745,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, stat.label, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 743,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 741,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "recipe-tag-list",
                    children: author.recipes.map((recipe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: recipe
                        }, recipe, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 751,
                            columnNumber: 43
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 750,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 729,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 728,
        columnNumber: 5
    }, this);
}
_c11 = AuthorProfilePage;
function MultilingualPage() {
    _s10();
    const { settings, applySettings, t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const [draftSettings, setDraftSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(settings);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MultilingualPage.useEffect": ()=>setDraftSettings(settings)
    }["MultilingualPage.useEffect"], [
        settings
    ]);
    const hasUnsavedChanges = draftSettings.language !== settings.language || draftSettings.unit !== settings.unit || draftSettings.region !== settings.region;
    const saveSettings = ()=>{
        applySettings(draftSettings);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(t('Cài đặt ngôn ngữ, đơn vị và khu vực đã được lưu.'));
    };
    const details = {
        vi: {
            label: 'Tiếng Việt',
            message: 'Mẹo nấu: bếp của bạn đang ở chế độ tiếng Việt với định dạng Việt Nam.'
        },
        en: {
            label: 'English',
            message: 'Cooking tips: your kitchen is in English with US-friendly measurement presets.'
        },
        fr: {
            label: 'Français',
            message: 'Conseils de cuisine : l’application est en français, avec des unités et formats pratiques.'
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "ĐA NGÔN NGỮ",
        title: "Tùy chỉnh ngôn ngữ & định dạng",
        intro: "Chuyển đổi ngôn ngữ, đơn vị đo lường và định dạng khu vực để phù hợp với người dùng và món ăn.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-columns multilingual-columns",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: t('Cài đặt hiển thị')
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 782,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 781,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "language-form",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        t('Ngôn ngữ'),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: draftSettings.language,
                                            onChange: (event)=>setDraftSettings((current)=>({
                                                        ...current,
                                                        language: event.target.value
                                                    })),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "vi",
                                                    children: t('Tiếng Việt')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 789,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "en",
                                                    children: "English"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 790,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "fr",
                                                    children: "Français"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 791,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 788,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 786,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        t('Đơn vị nguyên liệu'),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: draftSettings.unit,
                                            onChange: (event)=>setDraftSettings((current)=>({
                                                        ...current,
                                                        unit: event.target.value
                                                    })),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "g",
                                                    children: t('Gram / ml')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 797,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "oz",
                                                    children: t('Ounce / tbsp')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 798,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "cup",
                                                    children: t('Cup / cup')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 799,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 796,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 794,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        t('Khu vực'),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: draftSettings.region,
                                            onChange: (event)=>setDraftSettings((current)=>({
                                                        ...current,
                                                        region: event.target.value
                                                    })),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "VN",
                                                    children: t('Việt Nam')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 805,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "US",
                                                    children: t('Hoa Kỳ')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 806,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "EU",
                                                    children: t('Châu Âu')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 807,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 804,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 802,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 785,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "language-form-actions",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "feature-button primary",
                                onClick: saveSettings,
                                disabled: !hasUnsavedChanges,
                                children: t('Lưu cài đặt')
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 813,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 812,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 780,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: t('Xem trước')
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 821,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 820,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "language-preview",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: t(details[settings.language]?.label || 'Tiếng Việt')
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 825,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: details[settings.language]?.message
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 826,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                    children: [
                                        t('Đơn vị:'),
                                        " ",
                                        settings.unit,
                                        " • ",
                                        t('Khu vực'),
                                        ": ",
                                        t(settings.region === 'VN' ? 'Việt Nam' : settings.region === 'US' ? 'Hoa Kỳ' : 'Châu Âu')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 827,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 824,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 819,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 779,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 778,
        columnNumber: 5
    }, this);
}
_s10(MultilingualPage, "5GAPTlj05UdcVBXCVMn8Y2BdMTU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c12 = MultilingualPage;
function PrintExportPage() {
    const recipeSummary = {
        title: 'Sổ tay gia đình',
        items: [
            'Mì xào rau củ chay',
            'Canh chua cá',
            'Gỏi đậu phụ',
            'Bánh tráng trộn'
        ],
        notes: [
            'Chia sẻ với gia đình',
            'In chuẩn A4',
            'Xuất PDF để lưu giữ'
        ]
    };
    const handlePrint = ()=>window.print();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "BẢN IN & XUẤT SỔ TAY",
        title: "In ấn hoặc lưu dạng sổ tay",
        intro: "Xuất nội dung công thức thành bảng in đẹp, dễ đọc và sẵn sàng lưu vào sổ tay gia đình.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "feature-section print-shell",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "print-actions",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "feature-button primary",
                        onClick: handlePrint,
                        children: "In / Xuất PDF"
                    }, void 0, false, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 848,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 847,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "print-sheet",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "community-kicker",
                                    children: "BẾP NHÀ"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 853,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: recipeSummary.title
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 854,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 852,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            children: recipeSummary.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: item
                                }, item, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 858,
                                    columnNumber: 48
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 857,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "print-notes",
                            children: recipeSummary.notes.map((note)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: note
                                }, note, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 862,
                                    columnNumber: 48
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 861,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 851,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 846,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 845,
        columnNumber: 5
    }, this);
}
_c13 = PrintExportPage;
function AIAssistantPage() {
    _s11();
    const [activeProvider, setActiveProvider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('openai');
    const [openAiApiKey, setOpenAiApiKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AIAssistantPage.useState": ()=>localStorage.getItem('openAiApiKey') || ''
    }["AIAssistantPage.useState"]);
    const [geminiApiKey, setGeminiApiKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AIAssistantPage.useState": ()=>localStorage.getItem('geminiApiKey') || ''
    }["AIAssistantPage.useState"]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: 1,
            role: 'assistant',
            text: 'Xin chào! Tôi có thể giúp bạn lên thực đơn, giải thích công thức, kiểm tra nguyên liệu, tối ưu món theo khẩu vị, hoặc trả lời bất cứ câu hỏi nấu ăn nào.'
        }
    ]);
    const saveApiKey = ()=>{
        const apiKey = activeProvider === 'openai' ? openAiApiKey : geminiApiKey;
        const trimmed = apiKey.trim();
        if (!trimmed) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info(`Vui lòng nhập API key ${activeProvider === 'openai' ? 'OpenAI' : 'Gemini'} trước.`);
            return;
        }
        const storageKey = activeProvider === 'openai' ? 'openAiApiKey' : 'geminiApiKey';
        localStorage.setItem(storageKey, trimmed);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`API key ${activeProvider === 'openai' ? 'OpenAI' : 'Gemini'} đã được lưu trên thiết bị này.`);
    };
    const clearApiKey = ()=>{
        const storageKey = activeProvider === 'openai' ? 'openAiApiKey' : 'geminiApiKey';
        localStorage.removeItem(storageKey);
        if (activeProvider === 'openai') {
            setOpenAiApiKey('');
        } else {
            setGeminiApiKey('');
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info(`API key ${activeProvider === 'openai' ? 'OpenAI' : 'Gemini'} đã được xóa khỏi thiết bị này.`);
    };
    const sendMessage = async (event)=>{
        event.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;
        const storageKey = activeProvider === 'openai' ? 'openAiApiKey' : 'geminiApiKey';
        const enteredKey = activeProvider === 'openai' ? openAiApiKey : geminiApiKey;
        const key = (localStorage.getItem(storageKey) || enteredKey.trim()).trim();
        const providerName = activeProvider === 'openai' ? 'OpenAI' : 'Gemini';
        if (!key) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Vui lòng nhập API key ${providerName} trước khi gửi câu hỏi.`);
            return;
        }
        const userMessage = {
            id: Date.now(),
            role: 'user',
            text: trimmed
        };
        const conversation = [
            ...messages,
            userMessage
        ].map((message)=>({
                role: message.role,
                content: message.text
            }));
        setMessages((current)=>[
                ...current,
                userMessage
            ]);
        setInput('');
        setLoading(true);
        try {
            let answer = '';
            if (activeProvider === 'openai') {
                const response = await fetch(`${API}/openai/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    signal: AbortSignal.timeout(50000),
                    body: JSON.stringify({
                        apiKey: key,
                        messages: conversation
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data?.message || 'OpenAI trả về lỗi. Kiểm tra API key và billing.');
                }
                answer = data.answer;
            } else {
                const modelCandidates = [
                    'gemini-3.8-flash',
                    'gemini-3.7-flash',
                    'gemini-3.5-flash',
                    'gemini-3.1-flash-lite'
                ];
                const geminiContents = conversation.filter((message, index)=>index > 0 || message.role !== 'assistant').map((message)=>({
                        role: message.role === 'assistant' ? 'model' : 'user',
                        parts: [
                            {
                                text: message.content
                            }
                        ]
                    }));
                let lastError = '';
                for (const model of modelCandidates){
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        signal: AbortSignal.timeout(30000),
                        body: JSON.stringify({
                            systemInstruction: {
                                parts: [
                                    {
                                        text: 'You are the Bep Nha assistant. Help with cooking, recipes, ingredients, meal planning, and general questions. Answer clearly in the user\'s language.'
                                    }
                                ]
                            },
                            contents: geminiContents
                        })
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        const message = data?.error?.message || 'Gemini trả về lỗi.';
                        const normalizedMessage = message.toLowerCase();
                        const canTryNextModel = [
                            429,
                            500,
                            502,
                            503,
                            504
                        ].includes(response.status) || [
                            'not available',
                            'no longer available',
                            'not found',
                            'unsupported',
                            'high demand',
                            'overload',
                            'try again later',
                            'rate limit'
                        ].some((phrase)=>normalizedMessage.includes(phrase));
                        if (canTryNextModel) {
                            lastError = message;
                            continue;
                        }
                        throw new Error(message);
                    }
                    answer = data?.candidates?.[0]?.content?.parts?.map((part)=>part.text).join('').trim() || '';
                    if (answer) break;
                }
                if (!answer) {
                    throw new Error(lastError || 'Gemini không trả về nội dung. Kiểm tra key hoặc thử lại sau.');
                }
            }
            setMessages((current)=>[
                    ...current,
                    {
                        id: Date.now() + 1,
                        role: 'assistant',
                        text: answer
                    }
                ]);
        } catch (error) {
            const errorMessage = error?.name === 'TimeoutError' || error?.name === 'AbortError' ? `${providerName} không phản hồi trong thời gian chờ. Kiểm tra mạng rồi thử lại.` : error.message;
            setMessages((current)=>[
                    ...current,
                    {
                        id: Date.now() + 2,
                        role: 'assistant',
                        text: `Lỗi ${providerName}: ${errorMessage}`
                    }
                ]);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "CHAT VỚI AI",
        title: "Trợ lý nấu ăn thông minh",
        intro: "Hỏi mọi thứ về món ăn, thực đơn, nguyên liệu, khẩu vị, thời gian nấu, hay cách tối ưu hóa bữa ăn của bạn.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-columns ai-chat-columns",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section ai-key-panel",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Kết nối AI"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1010,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1009,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ai-provider-switch",
                            role: "tablist",
                            "aria-label": "Chọn nhà cung cấp AI",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    role: "tab",
                                    "aria-selected": activeProvider === 'openai',
                                    className: `ai-provider-tab${activeProvider === 'openai' ? ' active' : ''}`,
                                    onClick: ()=>setActiveProvider('openai'),
                                    children: "OpenAI"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1014,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    role: "tab",
                                    "aria-selected": activeProvider === 'gemini',
                                    className: `ai-provider-tab${activeProvider === 'gemini' ? ' active' : ''}`,
                                    onClick: ()=>setActiveProvider('gemini'),
                                    children: "Gemini"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1021,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1013,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "ai-key-row",
                            children: [
                                activeProvider === 'openai' ? 'OpenAI API key' : 'Gemini API key',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    value: activeProvider === 'openai' ? openAiApiKey : geminiApiKey,
                                    onChange: (event)=>activeProvider === 'openai' ? setOpenAiApiKey(event.target.value) : setGeminiApiKey(event.target.value),
                                    placeholder: activeProvider === 'openai' ? 'Dán API key từ platform.openai.com' : 'Dán API key Gemini từ Google AI Studio'
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1032,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1030,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ai-key-actions",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "feature-button primary",
                                    onClick: saveApiKey,
                                    children: "Lưu key"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1041,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "feature-button",
                                    onClick: clearApiKey,
                                    children: "Xóa key"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1042,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1040,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "ai-key-tip",
                            children: "Key của mỗi nhà cung cấp được lưu riêng trên trình duyệt này. OpenAI gọi qua backend local; Gemini gọi trực tiếp từ trình duyệt. Không dùng cấu hình này cho website công khai."
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1045,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1008,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section ai-chat-panel",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Phòng chat AI"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1050,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1049,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ai-chat-window",
                            children: [
                                messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: message.role === 'user' ? 'ai-message user' : 'ai-message assistant',
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ai-bubble",
                                            children: message.text
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1056,
                                            columnNumber: 17
                                        }, this)
                                    }, message.id, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1055,
                                        columnNumber: 15
                                    }, this)),
                                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "ai-message assistant",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ai-bubble typing",
                                        children: "AI đang suy nghĩ..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1063,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1062,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1053,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "ai-chat-form",
                            onSubmit: sendMessage,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: input,
                                    onChange: (event)=>setInput(event.target.value),
                                    rows: "4",
                                    placeholder: "Ví dụ: Cho tôi 3 món ăn chay cho bữa tối trong 20 phút, dựa trên nguyên liệu có sẵn trong tủ lạnh..."
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1069,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "feature-button primary",
                                    disabled: loading,
                                    children: loading ? 'Đang gửi...' : 'Gửi câu hỏi'
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1075,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1068,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1048,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1007,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1006,
        columnNumber: 5
    }, this);
}
_s11(AIAssistantPage, "XOXs5SfZtnWaC8f+Bgem4dPQFeo=");
_c14 = AIAssistantPage;
function CookModePage() {
    _s12();
    const { settings, t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const [scale, setScale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isRunning, setIsRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [screenLockActive, setScreenLockActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const wakeLockRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const recipe = {
        title: 'Mì xào rau củ chay',
        servings: 2,
        ingredients: [
            {
                name: 'Mì hạt sen',
                amount: '200',
                unit: 'g'
            },
            {
                name: 'Đậu phụ',
                amount: '150',
                unit: 'g'
            },
            {
                name: 'Đậu que',
                amount: '100',
                unit: 'g'
            },
            {
                name: 'Ớt chuông',
                amount: '1',
                unit: 'quả'
            },
            {
                name: 'Tỏi',
                amount: '3',
                unit: 'cây'
            },
            {
                name: 'Nước tương',
                amount: '20',
                unit: 'ml'
            }
        ],
        steps: [
            {
                title: 'Chuẩn bị nguyên liệu',
                duration: 180,
                text: 'Rửa sạch rau, cắt đậu phụ thành miếng vừa ăn và thái nhỏ hành tỏi, ớt chuông.'
            },
            {
                title: 'Đun nóng chảo',
                duration: 120,
                text: 'Cho 1 muỗng dầu vào chảo, đun ở lửa vừa đến khi dầu bắt đầu sủi nhẹ.'
            },
            {
                title: 'Xào rau củ',
                duration: 180,
                text: 'Cho tỏi, ớt và rau vào chảo, xào khoảng 2 phút cho mềm và thơm.'
            },
            {
                title: 'Thêm mì và đậu phụ',
                duration: 240,
                text: 'Cho mì và đậu phụ vào, đảo đều, thêm nước tương và tiếp tục xào cho các nguyên liệu thấm đều.'
            },
            {
                title: 'Hoàn thiện',
                duration: 60,
                text: 'Nếm lại và điều chỉnh gia vị. Món sẵn sàng cho bữa ăn.'
            }
        ]
    };
    const currentStepData = recipe.steps[currentStep] || recipe.steps[0];
    const [secondsLeft, setSecondsLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(currentStepData.duration);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CookModePage.useEffect": ()=>{
            setSecondsLeft(currentStepData.duration);
            setIsRunning(false);
        }
    }["CookModePage.useEffect"], [
        currentStep,
        currentStepData.duration
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CookModePage.useEffect": ()=>{
            if (!isRunning) return undefined;
            const timer = window.setInterval({
                "CookModePage.useEffect.timer": ()=>{
                    setSecondsLeft({
                        "CookModePage.useEffect.timer": (previous)=>{
                            if (previous <= 1) {
                                window.clearInterval(timer);
                                setIsRunning(false);
                                if ('speechSynthesis' in window) {
                                    const announcement = new SpeechSynthesisUtterance(`${t('Bước')} ${currentStep + 1}. ${t(recipe.steps[currentStep]?.title || 'Tiếp tục')}.`);
                                    announcement.lang = settings.language === 'en' ? 'en-US' : settings.language === 'fr' ? 'fr-FR' : 'vi-VN';
                                    window.speechSynthesis.cancel();
                                    window.speechSynthesis.speak(announcement);
                                }
                                return 0;
                            }
                            return previous - 1;
                        }
                    }["CookModePage.useEffect.timer"]);
                }
            }["CookModePage.useEffect.timer"], 1000);
            return ({
                "CookModePage.useEffect": ()=>window.clearInterval(timer)
            })["CookModePage.useEffect"];
        }
    }["CookModePage.useEffect"], [
        currentStep,
        isRunning,
        recipe.steps,
        settings.language,
        t
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CookModePage.useEffect": ()=>{
            return ({
                "CookModePage.useEffect": ()=>{
                    if (wakeLockRef.current) {
                        wakeLockRef.current.release().catch({
                            "CookModePage.useEffect": ()=>{}
                        }["CookModePage.useEffect"]);
                    }
                    if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                    }
                }
            })["CookModePage.useEffect"];
        }
    }["CookModePage.useEffect"], []);
    const speakCurrentStep = ()=>{
        if (!('speechSynthesis' in window)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Trình duyệt của bạn chưa hỗ trợ đọc to hướng dẫn.');
            return;
        }
        const utterance = new SpeechSynthesisUtterance(`${t('Bước')} ${currentStep + 1}. ${t(currentStepData.title)}. ${t(currentStepData.text)}`);
        utterance.lang = settings.language === 'en' ? 'en-US' : settings.language === 'fr' ? 'fr-FR' : 'vi-VN';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };
    const requestWakeLock = async ()=>{
        if (!('wakeLock' in navigator)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Thiết bị này không hỗ trợ giữ màn hình sáng.');
            return;
        }
        try {
            wakeLockRef.current = await navigator.wakeLock.request('screen');
            setScreenLockActive(true);
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Không giữ được màn hình sáng ở chế độ này.');
        }
    };
    const releaseWakeLock = async ()=>{
        if (!wakeLockRef.current) return;
        try {
            await wakeLockRef.current.release();
            wakeLockRef.current = null;
            setScreenLockActive(false);
        } catch  {
            setScreenLockActive(false);
        }
    };
    const scaledIngredients = recipe.ingredients.map((ingredient)=>({
            ...ingredient,
            quantity: (Number(ingredient.amount || 0) * scale).toFixed(scale < 1 ? 2 : 1)
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "NẤU CÙNG TÔI",
        title: "Chế độ nấu tay",
        intro: "Mỗi bước được phóng to, lời hướng dẫn được đọc thành tiếng, đồng hồ đếm thời gian luôn hiển thị và màn hình được giữ sáng trong lúc bạn nấu.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "cook-mode-shell",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section cook-mode-top",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cook-mode-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "community-kicker",
                                            children: t('Món hiện tại')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1203,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: t(recipe.title)
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1204,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1202,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "serving-control",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "feature-button",
                                            onClick: ()=>setScale((previous)=>Number(Math.max(0.5, Number((previous - 0.25).toFixed(2))).toFixed(2))),
                                            children: "−"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1207,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: [
                                                scale.toFixed(2),
                                                "x"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1208,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "feature-button",
                                            onClick: ()=>setScale((previous)=>Number(Math.min(4, Number((previous + 0.25).toFixed(2))).toFixed(2))),
                                            children: "+"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1209,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1206,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1201,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cook-mode-summary",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cook-mode-timer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                t('Bước'),
                                                " ",
                                                currentStep + 1,
                                                "/",
                                                recipe.steps.length
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1215,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: formatCountdown(secondsLeft)
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1216,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1214,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cook-mode-tools",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "feature-button primary",
                                            onClick: ()=>setIsRunning((value)=>!value),
                                            children: t(isRunning ? 'Tạm dừng' : 'Bắt đầu')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1220,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "feature-button",
                                            onClick: speakCurrentStep,
                                            children: t('Đọc to')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1223,
                                            columnNumber: 15
                                        }, this),
                                        !screenLockActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "feature-button",
                                            onClick: requestWakeLock,
                                            children: t('Giữ sáng màn hình')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1225,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "feature-button selected",
                                            onClick: releaseWakeLock,
                                            children: t('Tắt giữ sáng')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1227,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1219,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1213,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1200,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "feature-columns cook-mode-columns",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "feature-section cook-step-panel",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "community-kicker",
                                    children: [
                                        t('Bước'),
                                        " ",
                                        currentStep + 1
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1235,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: t(currentStepData.title)
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1236,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: t(currentStepData.text)
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1237,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cook-step-meta",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: t('Thời lượng')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1239,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: [
                                                Math.floor(currentStepData.duration / 60),
                                                " ",
                                                t('phút'),
                                                " ",
                                                currentStepData.duration % 60,
                                                " ",
                                                t('giây')
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1240,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1238,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cook-step-controls",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "feature-button",
                                            onClick: ()=>setCurrentStep((value)=>Math.max(0, value - 1)),
                                            disabled: currentStep === 0,
                                            children: t('Bước trước')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1244,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "feature-button primary",
                                            onClick: ()=>setCurrentStep((value)=>Math.min(recipe.steps.length - 1, value + 1)),
                                            disabled: currentStep === recipe.steps.length - 1,
                                            children: t('Bước sau')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1245,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1243,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1234,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "feature-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "feature-section-heading",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: t('Nguyên liệu')
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1251,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                recipe.servings * scale,
                                                " ",
                                                t('Khẩu phần').toLowerCase()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1252,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1250,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "cook-ingredient-list",
                                    children: scaledIngredients.map((ingredient)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: t(ingredient.name)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 1258,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: [
                                                        ingredient.quantity,
                                                        " ",
                                                        ingredient.unit
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 1259,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, ingredient.name, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1257,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1255,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cook-step-rail",
                                    children: recipe.steps.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: index === currentStep ? 'active' : '',
                                            onClick: ()=>setCurrentStep(index),
                                            children: index + 1
                                        }, step.title, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1266,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1264,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1249,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1233,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1199,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1198,
        columnNumber: 5
    }, this);
}
_s12(CookModePage, "5p6S7R2aF6XpqUNiJYNtYoUigww=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$LocaleContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c15 = CookModePage;
function RecipeEngagement({ recipe }) {
    _s13();
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [collections, setCollections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [collectionId, setCollectionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [reviewData, setReviewData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        averageRating: 0,
        count: 0,
        items: []
    });
    const [rating, setRating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [review, setReview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isCooked, setIsCooked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [refresh, setRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RecipeEngagement.useEffect": ()=>{
            let active = true;
            request(`/features/recipes/${recipe.id}/reviews`).then({
                "RecipeEngagement.useEffect": (data)=>{
                    if (active) setReviewData(data);
                }
            }["RecipeEngagement.useEffect"]).catch({
                "RecipeEngagement.useEffect": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message)
            }["RecipeEngagement.useEffect"]);
            if (getToken()) {
                Promise.all([
                    request('/features/bookmarks'),
                    request('/features/collections')
                ]).then({
                    "RecipeEngagement.useEffect": ([bookmarks, lists])=>{
                        if (!active) return;
                        setSaved(bookmarks.some({
                            "RecipeEngagement.useEffect": (item)=>item.recipe.id === recipe.id
                        }["RecipeEngagement.useEffect"]));
                        setCollections(lists);
                    }
                }["RecipeEngagement.useEffect"]).catch({
                    "RecipeEngagement.useEffect": ()=>{}
                }["RecipeEngagement.useEffect"]);
            }
            return ({
                "RecipeEngagement.useEffect": ()=>{
                    active = false;
                }
            })["RecipeEngagement.useEffect"];
        }
    }["RecipeEngagement.useEffect"], [
        recipe.id,
        refresh
    ]);
    const toggleSave = async ()=>{
        if (!getToken()) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đăng nhập để lưu công thức.');
        try {
            if (saved) await request(`/features/recipes/${recipe.id}/bookmark`, {
                method: 'DELETE'
            });
            else await request(`/features/recipes/${recipe.id}/bookmark`, {
                method: 'POST'
            });
            setSaved(!saved);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(saved ? 'Đã bỏ lưu công thức.' : 'Đã lưu công thức.');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const addToCollection = async ()=>{
        if (!collectionId) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Chọn bộ sưu tập trước.');
        try {
            await request(`/features/collections/${collectionId}/recipes/${recipe.id}`, {
                method: 'POST'
            });
            setSaved(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã thêm vào bộ sưu tập.');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const submitReview = async (event)=>{
        event.preventDefault();
        if (!getToken()) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đăng nhập để đánh giá món đã nấu.');
        setBusy(true);
        try {
            await request(`/features/recipes/${recipe.id}/reviews`, {
                method: 'POST',
                body: JSON.stringify({
                    rating: Number(rating),
                    content: review,
                    isCooked
                })
            });
            setReview('');
            setRefresh((value)=>value + 1);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Cảm ơn bạn đã chia sẻ trải nghiệm.');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        } finally{
            setBusy(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "feature-section recipe-engagement",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "engagement-top",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "community-kicker",
                                children: "CỘNG ĐỒNG ĐÃ NẤU"
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1337,
                                columnNumber: 42
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: [
                                    reviewData.averageRating ? `${Number(reviewData.averageRating).toFixed(1)} / 5` : 'Chưa có đánh giá',
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "★"
                                    }, void 0, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1337,
                                        columnNumber: 201
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1337,
                                columnNumber: 94
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: [
                                    reviewData.count,
                                    " đánh giá"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1337,
                                columnNumber: 220
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1337,
                        columnNumber: 37
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: saved ? 'feature-button selected' : 'feature-button',
                        onClick: toggleSave,
                        children: saved ? '♥ Đã lưu' : '♡ Lưu công thức'
                    }, void 0, false, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1337,
                        columnNumber: 268
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/PlatformFeaturePages.jsx",
                lineNumber: 1337,
                columnNumber: 5
            }, this),
            getToken() && collections.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "collection-quick-add",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: collectionId,
                        onChange: (event)=>setCollectionId(event.target.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Thêm vào bộ sưu tập..."
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1338,
                                columnNumber: 169
                            }, this),
                            collections.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: item.id,
                                    children: item.name
                                }, item.id, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1338,
                                    columnNumber: 242
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1338,
                        columnNumber: 84
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "feature-button",
                        onClick: addToCollection,
                        children: "Thêm"
                    }, void 0, false, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1338,
                        columnNumber: 311
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/PlatformFeaturePages.jsx",
                lineNumber: 1338,
                columnNumber: 46
            }, this),
            getToken() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "review-form",
                onSubmit: submitReview,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: "Món này thế nào?"
                    }, void 0, false, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1339,
                        columnNumber: 74
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "review-fields",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    "Đánh giá",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: rating,
                                        onChange: (event)=>setRating(event.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 5,
                                                children: "5 sao"
                                            }, void 0, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1339,
                                                columnNumber: 218
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 4,
                                                children: "4 sao"
                                            }, void 0, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1339,
                                                columnNumber: 250
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 3,
                                                children: "3 sao"
                                            }, void 0, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1339,
                                                columnNumber: 282
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 2,
                                                children: "2 sao"
                                            }, void 0, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1339,
                                                columnNumber: 314
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 1,
                                                children: "1 sao"
                                            }, void 0, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1339,
                                                columnNumber: 346
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1339,
                                        columnNumber: 145
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1339,
                                columnNumber: 130
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "cooked-check",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: isCooked,
                                        onChange: (event)=>setIsCooked(event.target.checked)
                                    }, void 0, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1339,
                                        columnNumber: 427
                                    }, this),
                                    " Tôi đã nấu món này"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1339,
                                columnNumber: 395
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1339,
                        columnNumber: 99
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: review,
                        onChange: (event)=>setReview(event.target.value),
                        placeholder: "Chia sẻ mẹo hoặc điều bạn đã thay đổi...",
                        maxLength: 1200
                    }, void 0, false, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1339,
                        columnNumber: 558
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "feature-button primary",
                        disabled: busy,
                        children: busy ? 'Đang gửi...' : 'Gửi đánh giá'
                    }, void 0, false, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1339,
                        columnNumber: 707
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/PlatformFeaturePages.jsx",
                lineNumber: 1339,
                columnNumber: 20
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "review-list",
                children: reviewData.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "review-item",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: item.fullName || item.username
                                    }, void 0, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1340,
                                        columnNumber: 116
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            '★'.repeat(item.rating),
                                            '☆'.repeat(5 - item.rating)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1340,
                                        columnNumber: 165
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        children: [
                                            new Date(item.createdAt).toLocaleDateString('vi-VN'),
                                            item.isCooked ? ' · Đã nấu' : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1340,
                                        columnNumber: 230
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1340,
                                columnNumber: 111
                            }, this),
                            item.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: item.content
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1340,
                                columnNumber: 356
                            }, this)
                        ]
                    }, item.id, true, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1340,
                        columnNumber: 64
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/PlatformFeaturePages.jsx",
                lineNumber: 1340,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1336,
        columnNumber: 10
    }, this);
}
_s13(RecipeEngagement, "UEbNZr8wqhII1IzQwXwNKw6Y/H4=");
_c16 = RecipeEngagement;
function SavedRecipesPage() {
    _s14();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const [bookmarks, setBookmarks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [collections, setCollections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedRecipe, setSelectedRecipe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedCollection, setSelectedCollection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const reload = ()=>Promise.all([
            request('/features/bookmarks'),
            request('/features/collections')
        ]).then(([saved, lists])=>{
            setBookmarks(saved);
            setCollections(lists);
        }).catch((error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message)).finally(()=>setLoading(false));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SavedRecipesPage.useEffect": ()=>{
            if (!getToken()) {
                navigate('/login');
                return;
            }
            reload();
        }
    }["SavedRecipesPage.useEffect"], [
        navigate
    ]);
    const createCollection = async (event)=>{
        event.preventDefault();
        try {
            await request('/features/collections', {
                method: 'POST',
                body: JSON.stringify({
                    name
                })
            });
            setName('');
            reload();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const addRecipe = async (event)=>{
        event.preventDefault();
        if (!selectedRecipe || !selectedCollection) return;
        try {
            await request(`/features/collections/${selectedCollection}/recipes/${selectedRecipe}`, {
                method: 'POST'
            });
            reload();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã thêm công thức vào bộ sưu tập.');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const unsave = async (recipeId)=>{
        try {
            await request(`/features/recipes/${recipeId}/bookmark`, {
                method: 'DELETE'
            });
            reload();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const deleteCollection = async (id)=>{
        if (!window.confirm('Xóa bộ sưu tập này?')) return;
        try {
            await request(`/features/collections/${id}`, {
                method: 'DELETE'
            });
            reload();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "CÔNG THỨC CỦA BẠN",
        title: "Đã lưu & bộ sưu tập",
        intro: "Gom những món muốn nấu vào các tuyển tập của riêng bạn.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-columns",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Công thức đã lưu"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1377,
                                    columnNumber: 116
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: bookmarks.length
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1377,
                                    columnNumber: 141
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1377,
                            columnNumber: 75
                        }, this),
                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "feature-empty",
                            children: "Đang tải..."
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1377,
                            columnNumber: 189
                        }, this) : bookmarks.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "saved-list",
                            children: bookmarks.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    className: "saved-recipe",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                    to: `/recipes/${item.recipe.id}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: item.recipe.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                        lineNumber: 1377,
                                                        columnNumber: 406
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 1377,
                                                    columnNumber: 366
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: [
                                                        item.recipe.categoryName,
                                                        item.recipe.cookingTimeMinutes ? ` · ${item.recipe.cookingTimeMinutes} phút` : ''
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 1377,
                                                    columnNumber: 449
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1377,
                                            columnNumber: 361
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            "aria-label": "Bỏ lưu",
                                            title: "Bỏ lưu",
                                            onClick: ()=>unsave(item.recipe.id),
                                            children: "♥"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1377,
                                            columnNumber: 579
                                        }, this)
                                    ]
                                }, item.recipe.id, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1377,
                                    columnNumber: 306
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1377,
                            columnNumber: 255
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "feature-empty",
                            children: "Chưa lưu công thức nào. Mở một món rồi chọn Lưu công thức."
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1377,
                            columnNumber: 706
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1377,
                    columnNumber: 38
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Bộ sưu tập"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1378,
                                    columnNumber: 85
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: collections.length
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1378,
                                    columnNumber: 104
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1378,
                            columnNumber: 44
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "inline-create-form",
                            onSubmit: createCollection,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: name,
                                    onChange: (event)=>setName(event.target.value),
                                    placeholder: "Ví dụ: Nấu cuối tuần",
                                    maxLength: 80,
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1378,
                                    columnNumber: 208
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "feature-button primary",
                                    children: "Tạo bộ sưu tập"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1378,
                                    columnNumber: 337
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1378,
                            columnNumber: 143
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "inline-create-form",
                            onSubmit: addRecipe,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: selectedCollection,
                                    onChange: (event)=>setSelectedCollection(event.target.value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Chọn bộ sưu tập"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1378,
                                            columnNumber: 565
                                        }, this),
                                        collections.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: item.id,
                                                children: item.name
                                            }, item.id, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1378,
                                                columnNumber: 631
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1378,
                                    columnNumber: 468
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: selectedRecipe,
                                    onChange: (event)=>setSelectedRecipe(event.target.value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Chọn công thức đã lưu"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1378,
                                            columnNumber: 789
                                        }, this),
                                        bookmarks.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: item.recipe.id,
                                                children: item.recipe.title
                                            }, item.recipe.id, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1378,
                                                columnNumber: 859
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1378,
                                    columnNumber: 700
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "feature-button",
                                    children: "Thêm món"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1378,
                                    columnNumber: 950
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1378,
                            columnNumber: 410
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "collection-list",
                            children: collections.map((collection)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    className: "collection-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "feature-section-heading",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    children: collection.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 1378,
                                                    columnNumber: 1171
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>deleteCollection(collection.id),
                                                    children: "Xóa"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 1378,
                                                    columnNumber: 1197
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1378,
                                            columnNumber: 1130
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                collection.count,
                                                " công thức"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1378,
                                            columnNumber: 1285
                                        }, this),
                                        collection.recipes.map((recipe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                to: `/recipes/${recipe.id}`,
                                                children: recipe.title
                                            }, recipe.id, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1378,
                                                columnNumber: 1354
                                            }, this))
                                    ]
                                }, collection.id, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1378,
                                    columnNumber: 1073
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1378,
                            columnNumber: 1009
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1378,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1377,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1376,
        columnNumber: 10
    }, this);
}
_s14(SavedRecipesPage, "04IQ8ioUaBynCchT3BBRs+ANbo0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"]
    ];
});
_c17 = SavedRecipesPage;
function mondayOf(date) {
    const value = new Date(`${date}T12:00:00`);
    value.setDate(value.getDate() - (value.getDay() + 6) % 7);
    return value.toISOString().slice(0, 10);
}
function shiftDate(date, amount) {
    const value = new Date(`${date}T12:00:00`);
    value.setDate(value.getDate() + amount);
    return value.toISOString().slice(0, 10);
}
function MealPlannerPage() {
    _s15();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const [weekStart, setWeekStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "MealPlannerPage.useState": ()=>mondayOf(new Date().toISOString().slice(0, 10))
    }["MealPlannerPage.useState"]);
    const [entries, setEntries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shopping, setShopping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recipes, setRecipes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recipeId, setRecipeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [plannedFor, setPlannedFor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(weekStart);
    const [mealType, setMealType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Bữa tối');
    const [servings, setServings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(2);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MealPlannerPage.useEffect": ()=>{
            if (!getToken()) {
                navigate('/login');
                return;
            }
            let active = true;
            Promise.all([
                request(`/features/meal-plan?weekStart=${weekStart}`),
                request(`/features/meal-plan/shopping-list?weekStart=${weekStart}`),
                fetch(`${API_V1}/recipes`).then(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readApiResponse"])
            ]).then({
                "MealPlannerPage.useEffect": ([plan, list, recipeList])=>{
                    if (active) {
                        setEntries(plan.entries);
                        setShopping(list.items);
                        setRecipes(recipeList);
                    }
                }
            }["MealPlannerPage.useEffect"]).catch({
                "MealPlannerPage.useEffect": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message)
            }["MealPlannerPage.useEffect"]).finally({
                "MealPlannerPage.useEffect": ()=>{
                    if (active) setLoading(false);
                }
            }["MealPlannerPage.useEffect"]);
            return ({
                "MealPlannerPage.useEffect": ()=>{
                    active = false;
                }
            })["MealPlannerPage.useEffect"];
        }
    }["MealPlannerPage.useEffect"], [
        weekStart,
        navigate
    ]);
    const reloadShopping = ()=>request(`/features/meal-plan/shopping-list?weekStart=${weekStart}`).then((data)=>setShopping(data.items)).catch((error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message));
    const addMeal = async (event)=>{
        event.preventDefault();
        try {
            await request('/features/meal-plan', {
                method: 'POST',
                body: JSON.stringify({
                    recipeId,
                    plannedFor,
                    mealType,
                    servings: Number(servings)
                })
            });
            const plan = await request(`/features/meal-plan?weekStart=${weekStart}`);
            setEntries(plan.entries);
            reloadShopping();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const removeMeal = async (id)=>{
        try {
            await request(`/features/meal-plan/${id}`, {
                method: 'DELETE'
            });
            setEntries((current)=>current.filter((item)=>item.id !== id));
            reloadShopping();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const toggleGrocery = async (item)=>{
        try {
            await request('/features/meal-plan/shopping-list', {
                method: 'PUT',
                body: JSON.stringify({
                    weekStart,
                    ingredient: item.ingredient,
                    isChecked: !item.isChecked
                })
            });
            reloadShopping();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const days = Array.from({
        length: 7
    }, (_, index)=>shiftDate(weekStart, index));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "LỊCH BẾP",
        title: "Thực đơn tuần",
        intro: "Chọn món trước, rồi mang theo danh sách nguyên liệu khi đi chợ.",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "week-controls",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "feature-button",
                        type: "button",
                        onClick: ()=>setWeekStart(shiftDate(weekStart, -7)),
                        children: "← Tuần trước"
                    }, void 0, false, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1432,
                        columnNumber: 36
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: [
                            new Date(`${weekStart}T12:00:00`).toLocaleDateString('vi-VN'),
                            " – ",
                            new Date(`${shiftDate(weekStart, 6)}T12:00:00`).toLocaleDateString('vi-VN')
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1432,
                        columnNumber: 161
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "feature-button",
                        type: "button",
                        onClick: ()=>setWeekStart(shiftDate(weekStart, 7)),
                        children: "Tuần sau →"
                    }, void 0, false, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1432,
                        columnNumber: 321
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/PlatformFeaturePages.jsx",
                lineNumber: 1432,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "feature-columns planner-columns",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "feature-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "feature-section-heading",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Thêm vào lịch"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1433,
                                    columnNumber: 132
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1433,
                                columnNumber: 91
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                className: "planner-form",
                                onSubmit: addMeal,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: [
                                            "Công thức",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: recipeId,
                                                onChange: (event)=>setRecipeId(event.target.value),
                                                required: true,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Chọn món"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                        lineNumber: 1433,
                                                        columnNumber: 312
                                                    }, this),
                                                    recipes.map((recipe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: recipe.id,
                                                            children: recipe.title
                                                        }, recipe.id, false, {
                                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                            lineNumber: 1433,
                                                            columnNumber: 369
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1433,
                                                columnNumber: 226
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1433,
                                        columnNumber: 210
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "planner-form-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: [
                                                    "Ngày",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: plannedFor,
                                                        onChange: (event)=>setPlannedFor(event.target.value),
                                                        children: days.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: day,
                                                                children: new Date(`${day}T12:00:00`).toLocaleDateString('vi-VN', {
                                                                    weekday: 'long',
                                                                    day: 'numeric',
                                                                    month: 'short'
                                                                })
                                                            }, day, false, {
                                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                                lineNumber: 1433,
                                                                columnNumber: 596
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                        lineNumber: 1433,
                                                        columnNumber: 498
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1433,
                                                columnNumber: 487
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: [
                                                    "Bữa",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: mealType,
                                                        onChange: (event)=>setMealType(event.target.value),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Bữa sáng"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                                lineNumber: 1433,
                                                                columnNumber: 843
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Bữa trưa"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                                lineNumber: 1433,
                                                                columnNumber: 868
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Bữa tối"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                                lineNumber: 1433,
                                                                columnNumber: 893
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Ăn nhẹ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                                lineNumber: 1433,
                                                                columnNumber: 917
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                        lineNumber: 1433,
                                                        columnNumber: 766
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1433,
                                                columnNumber: 756
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1433,
                                        columnNumber: 453
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: [
                                            "Khẩu phần",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: "1",
                                                max: "30",
                                                value: servings,
                                                onChange: (event)=>setServings(event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1433,
                                                columnNumber: 979
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1433,
                                        columnNumber: 963
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "feature-button primary",
                                        children: "Thêm vào lịch"
                                    }, void 0, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1433,
                                        columnNumber: 1096
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1433,
                                columnNumber: 160
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "plan-days",
                                children: days.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "plan-day",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                                children: new Date(`${day}T12:00:00`).toLocaleDateString('vi-VN', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'short'
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1433,
                                                columnNumber: 1252
                                            }, this),
                                            entries.filter((entry)=>entry.plannedFor === day).map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                                    className: "planned-meal",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: entry.mealType
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                            lineNumber: 1433,
                                                            columnNumber: 1484
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                            to: `/recipes/${entry.recipeId}`,
                                                            children: entry.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                            lineNumber: 1433,
                                                            columnNumber: 1513
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: [
                                                                entry.servings,
                                                                " khẩu phần"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                            lineNumber: 1433,
                                                            columnNumber: 1573
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            "aria-label": "Xóa món khỏi lịch",
                                                            onClick: ()=>removeMeal(entry.id),
                                                            children: "×"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                            lineNumber: 1433,
                                                            columnNumber: 1614
                                                        }, this)
                                                    ]
                                                }, entry.id, true, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 1433,
                                                    columnNumber: 1435
                                                }, this))
                                        ]
                                    }, day, true, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1433,
                                        columnNumber: 1212
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1433,
                                columnNumber: 1168
                            }, this),
                            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "feature-empty",
                                children: "Đang tải lịch..."
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1433,
                                columnNumber: 1756
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1433,
                        columnNumber: 54
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "feature-section grocery-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "feature-section-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Danh sách đi chợ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1434,
                                        columnNumber: 101
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            shopping.filter((item)=>!item.isChecked).length,
                                            " còn lại"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1434,
                                        columnNumber: 126
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1434,
                                columnNumber: 60
                            }, this),
                            shopping.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grocery-list",
                                children: shopping.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: item.isChecked ? 'grocery-item checked' : 'grocery-item',
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: item.isChecked,
                                                onChange: ()=>toggleGrocery(item)
                                            }, void 0, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1434,
                                                columnNumber: 364
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: item.ingredient
                                            }, void 0, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1434,
                                                columnNumber: 451
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                children: item.recipesCount > 1 ? `× ${item.recipesCount}` : ''
                                            }, void 0, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1434,
                                                columnNumber: 481
                                            }, this)
                                        ]
                                    }, item.key, true, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1434,
                                        columnNumber: 273
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1434,
                                columnNumber: 221
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "feature-empty",
                                children: "Thêm món vào lịch để tạo danh sách nguyên liệu."
                            }, void 0, false, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1434,
                                columnNumber: 570
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                        lineNumber: 1434,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/PlatformFeaturePages.jsx",
                lineNumber: 1433,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1431,
        columnNumber: 10
    }, this);
}
_s15(MealPlannerPage, "2/Toxm/vG+KphJMjU1egIKE0q7g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"]
    ];
});
_c18 = MealPlannerPage;
function ChallengesContent({ navigate, Navigation = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommunityNav"], useNextLinks = false }) {
    _s16();
    const [challenges, setChallenges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recipes, setRecipes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recipeId, setRecipeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [myId, setMyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [refresh, setRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChallengesContent.useEffect": ()=>{
            let active = true;
            Promise.all([
                request('/features/challenges'),
                fetch(`${API_V1}/recipes`).then(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readApiResponse"]),
                getToken() ? request('/account/me') : Promise.resolve(null)
            ]).then({
                "ChallengesContent.useEffect": ([items, recipeList, me])=>{
                    if (active) {
                        setChallenges(items);
                        setRecipes(recipeList);
                        setMyId(me?.id || '');
                    }
                }
            }["ChallengesContent.useEffect"]).catch({
                "ChallengesContent.useEffect": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message)
            }["ChallengesContent.useEffect"]).finally({
                "ChallengesContent.useEffect": ()=>{
                    if (active) setLoading(false);
                }
            }["ChallengesContent.useEffect"]);
            return ({
                "ChallengesContent.useEffect": ()=>{
                    active = false;
                }
            })["ChallengesContent.useEffect"];
        }
    }["ChallengesContent.useEffect"], [
        refresh
    ]);
    const submit = async (challengeId, event)=>{
        event.preventDefault();
        if (!getToken()) return navigate('/login');
        try {
            await request(`/features/challenges/${challengeId}/submit`, {
                method: 'POST',
                body: JSON.stringify({
                    recipeId
                })
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Bạn đã tham gia thử thách!');
            setRefresh((value)=>value + 1);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const LoginLink = useNextLinks ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"];
    const loginLinkProps = useNextLinks ? {
        href: '/login'
    } : {
        to: '/login'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        Navigation: Navigation,
        eyebrow: "SÂN CHƠI CỘNG ĐỒNG",
        title: "Thử thách nấu ăn",
        intro: "Mỗi tuần một chủ đề mới. Chọn công thức do bạn tạo để tham gia và nhận huy hiệu.",
        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "feature-empty",
            children: "Đang tải thử thách..."
        }, void 0, false, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1461,
            columnNumber: 16
        }, this) : challenges.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "challenge-grid",
            children: challenges.map((challenge)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    className: "challenge-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "community-kicker",
                            children: new Date(challenge.endsAt).toLocaleDateString('vi-VN') === new Date().toLocaleDateString('vi-VN') ? 'KẾT THÚC HÔM NAY' : 'THỬ THÁCH ĐANG MỞ'
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1461,
                            columnNumber: 209
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: challenge.title
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1461,
                            columnNumber: 387
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: challenge.theme
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1461,
                            columnNumber: 413
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "challenge-progress",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: challenge.entriesCount
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1461,
                                    columnNumber: 473
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "bài dự thi"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1461,
                                    columnNumber: 514
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: new Date(challenge.endsAt).toLocaleDateString('vi-VN')
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1461,
                                    columnNumber: 537
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1461,
                            columnNumber: 437
                        }, this),
                        challenge.enteredByMe ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "challenge-entered",
                            children: "✓ Bạn đã tham gia"
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1461,
                            columnNumber: 637
                        }, this) : myId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "challenge-submit",
                            onSubmit: (event)=>submit(challenge.id, event),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: recipeId,
                                    onChange: (event)=>setRecipeId(event.target.value),
                                    required: true,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Chọn công thức của bạn"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1461,
                                            columnNumber: 873
                                        }, this),
                                        recipes.filter((recipe)=>recipe.authorId === myId).map((recipe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: recipe.id,
                                                children: recipe.title
                                            }, recipe.id, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1461,
                                                columnNumber: 987
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1461,
                                    columnNumber: 787
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "feature-button primary",
                                    children: "Gửi dự thi"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1461,
                                    columnNumber: 1063
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1461,
                            columnNumber: 705
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginLink, {
                            className: "feature-button primary",
                            ...loginLinkProps,
                            children: "Đăng nhập để tham gia"
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1461,
                            columnNumber: 1135
                        }, this)
                    ]
                }, challenge.id, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1461,
                    columnNumber: 154
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1461,
            columnNumber: 93
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "feature-empty",
            children: "Chưa có thử thách nào."
        }, void 0, false, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1461,
            columnNumber: 1256
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1460,
        columnNumber: 10
    }, this);
}
_s16(ChallengesContent, "tjdJgs2fRsFLepePE9hyU6jH4i4=");
_c19 = ChallengesContent;
function ChallengesPage() {
    _s17();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChallengesContent, {
        navigate: navigate
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1467,
        columnNumber: 10
    }, this);
}
_s17(ChallengesPage, "CzcTeTziyjMsSrAVmHuCCb6+Bfg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"]
    ];
});
_c20 = ChallengesPage;
function NextChallengesPage() {
    _s18();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChallengesContent, {
        navigate: (path)=>router.push(path),
        Navigation: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NextCommunityNav"],
        useNextLinks: true
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1472,
        columnNumber: 10
    }, this);
}
_s18(NextChallengesPage, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c21 = NextChallengesPage;
function CreatorDashboardContent({ navigate, Navigation = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommunityNav"], useNextLinks = false }) {
    _s19();
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreatorDashboardContent.useEffect": ()=>{
            if (!getToken()) {
                navigate('/login');
                return;
            }
            request('/features/creator/stats').then(setStats).catch({
                "CreatorDashboardContent.useEffect": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message)
            }["CreatorDashboardContent.useEffect"]);
        }
    }["CreatorDashboardContent.useEffect"], [
        navigate
    ]);
    const metrics = stats ? [
        [
            'Công thức',
            stats.recipeCount
        ],
        [
            'Lượt xem',
            stats.recipeViews
        ],
        [
            'Lượt lưu',
            stats.savedCount
        ],
        [
            'Bài viết',
            stats.postCount
        ],
        [
            'Lượt thích',
            stats.receivedLikes
        ],
        [
            'Bình luận',
            stats.receivedComments
        ]
    ] : [];
    const DashboardLink = useNextLinks ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"];
    const recipesLinkProps = useNextLinks ? {
        href: '/recipes/new'
    } : {
        to: '/recipes/new'
    };
    const accountLinkProps = useNextLinks ? {
        href: '/account'
    } : {
        to: '/account'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        Navigation: Navigation,
        eyebrow: "BẾP CỦA BẠN",
        title: "Tổng quan tác giả",
        intro: "Theo dõi những gì cộng đồng đang đón nhận từ các công thức và bài viết của bạn.",
        children: stats ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "creator-metrics",
                    children: metrics.map(([label, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            className: "metric-card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: label
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1489,
                                    columnNumber: 126
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: value.toLocaleString('vi-VN')
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1489,
                                    columnNumber: 146
                                }, this)
                            ]
                        }, label, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1489,
                            columnNumber: 81
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1489,
                    columnNumber: 16
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "creator-actions",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardLink, {
                            ...recipesLinkProps,
                            children: "+ Tạo công thức"
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1489,
                            columnNumber: 245
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardLink, {
                            ...accountLinkProps,
                            children: "Cập nhật hồ sơ →"
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1489,
                            columnNumber: 313
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1489,
                    columnNumber: 212
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1489,
            columnNumber: 14
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "feature-empty",
            children: "Đang tải số liệu..."
        }, void 0, false, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1489,
            columnNumber: 394
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1488,
        columnNumber: 10
    }, this);
}
_s19(CreatorDashboardContent, "QHCAg5+sC7SrLiGx+x4h2IICBFk=");
_c22 = CreatorDashboardContent;
function CreatorDashboardPage() {
    _s20();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CreatorDashboardContent, {
        navigate: navigate
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1495,
        columnNumber: 10
    }, this);
}
_s20(CreatorDashboardPage, "CzcTeTziyjMsSrAVmHuCCb6+Bfg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"]
    ];
});
_c23 = CreatorDashboardPage;
function NextCreatorDashboardPage() {
    _s21();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CreatorDashboardContent, {
        navigate: (path)=>router.push(path),
        Navigation: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$CommunityPages$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NextCommunityNav"],
        useNextLinks: true
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1500,
        columnNumber: 10
    }, this);
}
_s21(NextCreatorDashboardPage, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c24 = NextCreatorDashboardPage;
function NotificationsPage() {
    _s22();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        unreadCount: 0,
        items: []
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [refresh, setRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationsPage.useEffect": ()=>{
            if (!getToken()) {
                navigate('/login');
                return;
            }
            request('/features/notifications').then(setData).catch({
                "NotificationsPage.useEffect": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message)
            }["NotificationsPage.useEffect"]).finally({
                "NotificationsPage.useEffect": ()=>setLoading(false)
            }["NotificationsPage.useEffect"]);
        }
    }["NotificationsPage.useEffect"], [
        navigate,
        refresh
    ]);
    const markRead = async (id)=>{
        try {
            await request(`/features/notifications/${id}/read`, {
                method: 'PUT'
            });
            setRefresh((value)=>value + 1);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const markAllRead = async ()=>{
        try {
            await request('/features/notifications/read-all', {
                method: 'PUT'
            });
            setRefresh((value)=>value + 1);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "CẬP NHẬT CỦA BẠN",
        title: "Thông báo",
        intro: "Lượt theo dõi, yêu thích và cuộc trò chuyện mới nhất.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-section",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "feature-section-heading",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: data.unreadCount ? `${data.unreadCount} chưa đọc` : 'Đã cập nhật'
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1515,
                            columnNumber: 79
                        }, this),
                        data.unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "text-command",
                            onClick: markAllRead,
                            children: "Đánh dấu đã đọc tất cả"
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1515,
                            columnNumber: 180
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1515,
                    columnNumber: 38
                }, this),
                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "feature-empty",
                    children: "Đang tải thông báo..."
                }, void 0, false, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1515,
                    columnNumber: 298
                }, this) : data.items.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "notification-list",
                    children: data.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            className: item.readAt ? 'notification-item' : 'notification-item unread',
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                    to: item.targetUrl || '/community',
                                    onClick: ()=>!item.readAt && markRead(item.id),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "notification-avatar",
                                            children: item.actor.fullName?.slice(0, 1) || item.actor.username?.slice(0, 1) || 'B'
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1515,
                                            columnNumber: 624
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: item.actor.fullName || item.actor.username
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 1515,
                                                    columnNumber: 750
                                                }, this),
                                                " ",
                                                item.message,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: new Date(item.createdAt).toLocaleString('vi-VN')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                    lineNumber: 1515,
                                                    columnNumber: 826
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1515,
                                            columnNumber: 744
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1515,
                                    columnNumber: 532
                                }, this),
                                !item.readAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>markRead(item.id),
                                    children: "Đánh dấu đã đọc"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1515,
                                    columnNumber: 922
                                }, this)
                            ]
                        }, item.id, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1515,
                            columnNumber: 434
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1515,
                    columnNumber: 375
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "feature-empty",
                    children: "Chưa có thông báo mới."
                }, void 0, false, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1515,
                    columnNumber: 1024
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1515,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1514,
        columnNumber: 10
    }, this);
}
_s22(NotificationsPage, "55RTFImzb96p5iC1jXhIX2j8EG0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"]
    ];
});
_c25 = NotificationsPage;
function SafetyPage() {
    _s23();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const [blocked, setBlocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [reports, setReports] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [refresh, setRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SafetyPage.useEffect": ()=>{
            if (!getToken()) {
                navigate('/login');
                return;
            }
            Promise.all([
                request('/community/blocks'),
                request('/community/reports/mine')
            ]).then({
                "SafetyPage.useEffect": ([blockedUsers, myReports])=>{
                    setBlocked(blockedUsers);
                    setReports(myReports);
                }
            }["SafetyPage.useEffect"]).catch({
                "SafetyPage.useEffect": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message)
            }["SafetyPage.useEffect"]).finally({
                "SafetyPage.useEffect": ()=>setLoading(false)
            }["SafetyPage.useEffect"]);
        }
    }["SafetyPage.useEffect"], [
        navigate,
        refresh
    ]);
    const unblock = async (username)=>{
        try {
            await request(`/community/users/${encodeURIComponent(username)}/block`, {
                method: 'DELETE'
            });
            setRefresh((value)=>value + 1);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "QUYỀN RIÊNG TƯ",
        title: "An toàn cộng đồng",
        intro: "Quản lý thành viên bạn đã chặn và theo dõi các báo cáo đã gửi.",
        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "feature-empty",
            children: "Đang tải cài đặt an toàn..."
        }, void 0, false, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1536,
            columnNumber: 16
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "feature-columns",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Thành viên đã chặn"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1536,
                                    columnNumber: 190
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: blocked.length
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1536,
                                    columnNumber: 217
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1536,
                            columnNumber: 149
                        }, this),
                        blocked.length ? blocked.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "connection-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                        to: `/members/${encodeURIComponent(user.username)}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "notification-avatar",
                                                children: user.fullName?.slice(0, 1) || user.username?.slice(0, 1)
                                            }, void 0, false, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1536,
                                                columnNumber: 405
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: user.fullName || user.username
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                        lineNumber: 1536,
                                                        columnNumber: 512
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                        children: [
                                                            "@",
                                                            user.username
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                        lineNumber: 1536,
                                                        columnNumber: 561
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                                lineNumber: 1536,
                                                columnNumber: 506
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1536,
                                        columnNumber: 346
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>unblock(user.username),
                                        children: "Bỏ chặn"
                                    }, void 0, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1536,
                                        columnNumber: 606
                                    }, this)
                                ]
                            }, user.username, true, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1536,
                                columnNumber: 290
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "feature-empty",
                            children: "Bạn chưa chặn thành viên nào."
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1536,
                            columnNumber: 697
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1536,
                    columnNumber: 112
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "feature-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "feature-section-heading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Báo cáo đã gửi"
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1536,
                                    columnNumber: 848
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: reports.length
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1536,
                                    columnNumber: 871
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1536,
                            columnNumber: 807
                        }, this),
                        reports.length ? reports.map((report)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "report-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: report.targetType === 'post' ? 'Bài viết' : 'Thành viên'
                                    }, void 0, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1536,
                                        columnNumber: 995
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: report.reason
                                    }, void 0, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1536,
                                        columnNumber: 1070
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        children: [
                                            new Date(report.createdAt).toLocaleString('vi-VN'),
                                            " · ",
                                            report.resolvedAt ? 'Đã xem xét' : 'Đang chờ xem xét'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1536,
                                        columnNumber: 1098
                                    }, this)
                                ]
                            }, report.id, true, {
                                fileName: "[project]/src/PlatformFeaturePages.jsx",
                                lineNumber: 1536,
                                columnNumber: 946
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "feature-empty",
                            children: "Chưa gửi báo cáo nào."
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1536,
                            columnNumber: 1237
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1536,
                    columnNumber: 770
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1536,
            columnNumber: 79
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1535,
        columnNumber: 10
    }, this);
}
_s23(SafetyPage, "665u+FX6L5pU9CUNW2uENDKBB7E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"]
    ];
});
_c26 = SafetyPage;
function DraftsPage() {
    _s24();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const [drafts, setDrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [refresh, setRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraftsPage.useEffect": ()=>{
            if (!getToken()) {
                navigate('/login');
                return;
            }
            request('/community/drafts').then(setDrafts).catch({
                "DraftsPage.useEffect": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message)
            }["DraftsPage.useEffect"]).finally({
                "DraftsPage.useEffect": ()=>setLoading(false)
            }["DraftsPage.useEffect"]);
        }
    }["DraftsPage.useEffect"], [
        navigate,
        refresh
    ]);
    const saveDraft = async (event)=>{
        event.preventDefault();
        try {
            await request(`/community/posts/${editingId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    content,
                    isDraft: true
                })
            });
            setEditingId('');
            setRefresh((value)=>value + 1);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const publish = async (id)=>{
        try {
            const draft = drafts.find((item)=>item.id === id);
            await request(`/community/posts/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    content: draft.content,
                    mediaUrl: draft.mediaUrl,
                    mediaType: draft.mediaType,
                    isDraft: false
                })
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Bài viết đã được đăng.');
            setRefresh((value)=>value + 1);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    const remove = async (id)=>{
        if (!window.confirm('Xóa bản nháp này?')) return;
        try {
            await request(`/community/posts/${id}`, {
                method: 'DELETE'
            });
            setRefresh((value)=>value + 1);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeatureShell, {
        eyebrow: "BÀI VIẾT CỦA BẠN",
        title: "Bản nháp",
        intro: "Lưu ý tưởng lại và đăng khi bạn đã sẵn sàng.",
        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "feature-empty",
            children: "Đang tải bản nháp..."
        }, void 0, false, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1566,
            columnNumber: 16
        }, this) : drafts.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "draft-list",
            children: drafts.map((draft)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    className: "draft-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                            children: new Date(draft.createdAt).toLocaleString('vi-VN')
                        }, void 0, false, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1566,
                            columnNumber: 184
                        }, this),
                        editingId === draft.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "post-edit-form",
                            onSubmit: saveDraft,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: content,
                                    onChange: (event)=>setContent(event.target.value),
                                    maxLength: 3000
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1566,
                                    columnNumber: 330
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "feature-button",
                                            onClick: ()=>setEditingId(''),
                                            children: "Hủy"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1566,
                                            columnNumber: 431
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "feature-button primary",
                                            children: "Lưu bản nháp"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1566,
                                            columnNumber: 525
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1566,
                                    columnNumber: 426
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1566,
                            columnNumber: 276
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: draft.content
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1566,
                                    columnNumber: 607
                                }, this),
                                draft.mediaUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "post-media",
                                    children: draft.mediaType === 'video' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                        src: draft.mediaUrl,
                                        controls: true,
                                        playsInline: true,
                                        preload: "metadata"
                                    }, void 0, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1566,
                                        columnNumber: 707
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: draft.mediaUrl,
                                        alt: "Ảnh trong bản nháp",
                                        loading: "lazy"
                                    }, void 0, false, {
                                        fileName: "[project]/src/PlatformFeaturePages.jsx",
                                        lineNumber: 1566,
                                        columnNumber: 780
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1566,
                                    columnNumber: 648
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "draft-actions",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "feature-button",
                                            onClick: ()=>{
                                                setEditingId(draft.id);
                                                setContent(draft.content);
                                            },
                                            children: "Sửa"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1566,
                                            columnNumber: 887
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "feature-button primary",
                                            onClick: ()=>publish(draft.id),
                                            children: "Đăng bài"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1566,
                                            columnNumber: 1018
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "feature-button danger",
                                            onClick: ()=>remove(draft.id),
                                            children: "Xóa"
                                        }, void 0, false, {
                                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                                            lineNumber: 1566,
                                            columnNumber: 1126
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                                    lineNumber: 1566,
                                    columnNumber: 856
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/PlatformFeaturePages.jsx",
                            lineNumber: 1566,
                            columnNumber: 605
                        }, this)
                    ]
                }, draft.id, true, {
                    fileName: "[project]/src/PlatformFeaturePages.jsx",
                    lineNumber: 1566,
                    columnNumber: 137
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1566,
            columnNumber: 88
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "feature-empty",
            children: "Chưa có bản nháp nào. Bạn có thể lưu bài từ bảng tin."
        }, void 0, false, {
            fileName: "[project]/src/PlatformFeaturePages.jsx",
            lineNumber: 1566,
            columnNumber: 1258
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/PlatformFeaturePages.jsx",
        lineNumber: 1565,
        columnNumber: 10
    }, this);
}
_s24(DraftsPage, "eJNJ0KQcLe3ambz0nKe/M2SoLRY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"]
    ];
});
_c27 = DraftsPage;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19, _c20, _c21, _c22, _c23, _c24, _c25, _c26, _c27;
__turbopack_context__.k.register(_c, "FeatureShell");
__turbopack_context__.k.register(_c1, "FridgeMatchPage");
__turbopack_context__.k.register(_c2, "FlexibleRecipePage");
__turbopack_context__.k.register(_c3, "RecipeJournalPage");
__turbopack_context__.k.register(_c4, "RecipeQnaPage");
__turbopack_context__.k.register(_c5, "CookTogetherPage");
__turbopack_context__.k.register(_c6, "CookbookShelfPage");
__turbopack_context__.k.register(_c7, "TasteSuggestionPage");
__turbopack_context__.k.register(_c8, "SeasonalChallengePage");
__turbopack_context__.k.register(_c9, "StandardRecipePage");
__turbopack_context__.k.register(_c10, "EditorPicksPage");
__turbopack_context__.k.register(_c11, "AuthorProfilePage");
__turbopack_context__.k.register(_c12, "MultilingualPage");
__turbopack_context__.k.register(_c13, "PrintExportPage");
__turbopack_context__.k.register(_c14, "AIAssistantPage");
__turbopack_context__.k.register(_c15, "CookModePage");
__turbopack_context__.k.register(_c16, "RecipeEngagement");
__turbopack_context__.k.register(_c17, "SavedRecipesPage");
__turbopack_context__.k.register(_c18, "MealPlannerPage");
__turbopack_context__.k.register(_c19, "ChallengesContent");
__turbopack_context__.k.register(_c20, "ChallengesPage");
__turbopack_context__.k.register(_c21, "NextChallengesPage");
__turbopack_context__.k.register(_c22, "CreatorDashboardContent");
__turbopack_context__.k.register(_c23, "CreatorDashboardPage");
__turbopack_context__.k.register(_c24, "NextCreatorDashboardPage");
__turbopack_context__.k.register(_c25, "NotificationsPage");
__turbopack_context__.k.register(_c26, "SafetyPage");
__turbopack_context__.k.register(_c27, "DraftsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_PlatformFeaturePages_jsx_049472y._.js.map