const priorities = [
    {
        id: '1',
        name: '权限管理',
        checked: false,
        children: [
            {
                id: '1_1',
                parent_id: '1',
                name: '员工管理',
                children: [
                    {
                        id: '1_1_1',
                        parent_id: '1_1',
                        name: '新建员工',
                        children: [

                        ],
                    },
                    {
                        id: '1_1_2',
                        parent_id: '1_1',
                        name: '删除员工',
                        children: [

                        ],
                    },
                    {
                        id: '1_1_3',
                        parent_id: '1_1',
                        name: '编辑员工',
                        children: [
                            {
                                id: '1_1_3_1',
                                parent_id: '1_1_3',
                                name: '全部',
                                children: [

                                ],
                            },
                            {
                                id: '1_1_3_2',
                                parent_id: '1_1_3',
                                name: '仅自己',
                                children: [

                                ],
                            },

                        ],
                    },
                ],
            },
            {
                id: '1',
                name: '绣花管理',
                children: [

                ],
            },

        ],
    },
];

const priorities2 = [
    {
        id: '1',
        name: '权限管理',
        checked: true,
        children: [
            {
                id: '1_1',
                parent_id: '1',
                checked: true,
                name: '员工管理',
                children: [
                    {
                        checked: true,
                        id: '1_1_1',
                        parent_id: '1_1',
                        name: '新建员工',
                        children: [

                        ],
                    },
                    {
                        checked: true,
                        id: '1_1_2',
                        parent_id: '1_1',
                        name: '删除员工',
                        children: [

                        ],
                    },
                    {
                        checked: true,
                        id: '1_1_3',
                        parent_id: '1_1',
                        name: '编辑员工',
                        children: [
                            {
                                checked: true,
                                id: '1_1_3_1',
                                parent_id: '1_1_3',
                                name: '全部',
                                children: [

                                ],
                            },
                            {
                                checked: true,
                                id: '1_1_3_2',
                                parent_id: '1_1_3',
                                name: '仅自己',
                                children: [

                                ],
                            },

                        ],
                    },
                ],
            },
            {
                checked: false,
                id: '1_2',
                name: '绣花管理',
                children: [

                ],
            },

        ],
    },
]

/**
 * 深度优先 遍历查询数组中匹配的项并返回
 * @param ps 所有权限
 * @param p
 * @returns {*}
 */
function loopFind(ps = [], p){
    let fundP = null;
    let fundPP = null;
    for(let i = 0, l = ps.length; i < l; i++){
        if(ps[i].id === p.id){
            fundP = ps[i];
            break;
        }else if(ps[i].children){
            if(fundPP = loopFind(ps[i].children, p)){
                fundP = fundPP;
                break;
            }
        }
    }

    return fundP;
}

/**
 * 循环 勾选or去勾选
 * 勾选一项:   勾选自己,  勾选所有子级
 * 去勾选一项: 反勾选自己, 反勾选所有子级, 当同级项都为去勾选状态时 反勾选父级并对父级做相同操作
 * @param ps 所有权限
 * @param p
 * @param bool 本次要勾选的结果
 */
function loopCheck(ps, p, bool){
    if(p){
        if(bool){
            // 勾选
            const checkTrue = true;
            p.checked = checkTrue;
            if(p.children){
                p.children.forEach(pp => {
                    pp.checked = checkTrue;
                })
            }
        }else{
            // 去勾选
            const checkFalse = false;
            p.checked = checkFalse;

            // 所有子级全部反勾选
            if(p.children){
                p.children.forEach(pp => {
                    pp.checked = checkFalse;
                })
            }

            // 循环父级反勾选判断
            let parentP = loopFind(ps, {id: p.parent_id})
            if(parentP && (parentP.children || []).every(vo => !vo.checked)){
                loopCheck(ps, parentP, checkFalse)
            }
        }
    }
}

/**
 * 级联check,
 * check父, 所有子都check,
 * uncheck
 *
 *
 * @param p
 * @param bool
 */
function cascadeCheckOp(ps, p, bool){
    let fundP = loopFind(ps, p)
    loopCheck(ps, fundP, bool)
    console.log('cascadeCheckOpResult:',clone(ps))
}

function clone(o){
    return JSON.parse(JSON.stringify(o))
}

// test
console.log('test_loopFind: ',loopFind(clone(priorities), {id: '1_1'}))

console.log('test_cascadeCheckOp->true')
cascadeCheckOp(clone(priorities), {id: '1_1'}, true)

console.log('test_cascadeCheckOp->false')
console.log('before_test_ps2', clone(priorities2));
cascadeCheckOp(clone(priorities2), {id: '1_1'}, false)

