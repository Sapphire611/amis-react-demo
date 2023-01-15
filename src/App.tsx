import React from 'react';

import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/v4-shims.css';

import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';

import axios from 'axios';
import copy from 'copy-to-clipboard';

import {render as renderAmis, ToastComponent, AlertComponent} from 'amis';
import {alert, confirm, toast} from 'amis-ui';

// amis 环境配置
const env = {
  // 下面三个接口必须实现
  fetcher: ({
    url, // 接口地址
    method, // 请求方法 get、post、put、delete
    data, // 请求数据
    responseType,
    config, // 其他配置
    headers // 请求头
  }: any) => {
    config = config || {};
    config.withCredentials = true;
    responseType && (config.responseType = responseType);

    if (config.cancelExecutor) {
      config.cancelToken = new (axios as any).CancelToken(
        config.cancelExecutor
      );
    }

    config.headers = headers || {};

    if (method !== 'post' && method !== 'put' && method !== 'patch') {
      if (data) {
        config.params = data;
      }
      return (axios as any)[method](url, config);
    } else if (data && data instanceof FormData) {
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (
      data &&
      typeof data !== 'string' &&
      !(data instanceof Blob) &&
      !(data instanceof ArrayBuffer)
    ) {
      data = JSON.stringify(data);
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'application/json';
    }

    return (axios as any)[method](url, data, config);
  },
  isCancel: (value: any) => (axios as any).isCancel(value),
  copy: (content: string) => {
    copy(content);
    toast.success('内容已复制到粘贴板');
  }

  // 后面这些接口可以不用实现

  // 默认是地址跳转
  // jumpTo: (
  //   location: string /*目标地址*/,
  //   action: any /* action对象*/
  // ) => {
  //   // 用来实现页面跳转, actionType:link、url 都会进来。
  // },

  // updateLocation: (
  //   location: string /*目标地址*/,
  //   replace: boolean /*是replace，还是push？*/
  // ) => {
  //   // 地址替换，跟 jumpTo 类似
  // },

  // isCurrentUrl: (
  //   url: string /*url地址*/,
  // ) => {
  //   // 用来判断是否目标地址当前地址
  // },

  // notify: (
  //   type: 'error' | 'success' /**/,
  //   msg: string /*提示内容*/
  // ) => {
  //   toast[type]
  //     ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
  //     : console.warn('[Notify]', type, msg);
  // },
  // alert,
  // confirm,
};

class AMISComponent extends React.Component<any, any> {
  render() {
    return renderAmis(
      {
        type: 'page',
        title: 'From Sapphire611',
        remark: '看了一晚上,没弄明白怎么拿列表中的id去请求详情,只能先这样了',
        toolbar: [
          {
            type: 'button',
            actionType: 'dialog',
            label: '新增',
            icon: 'fa fa-plus pull-left',
            primary: true,
            dialog: {
              title: '新增',
              body: {
                type: 'form',
                name: 'sample-edit-form',
                api: {
                  method: 'post',
                  url: 'https://demo.steedos.cn/api/v4/project',
                  headers: {
                    Authorization:
                      'Bearer FpGqunHSCxQStcHFn,16cd4425f03d73855ce6c76fdaacdbda1b30846c29fd7e3819df05b6e6cc1304c693dde5511b432660a08a'
                  }
                },
                body: [
                  {
                    type: 'input-text',
                    name: 'name',
                    label: '项目名称'
                  },
                  {
                    type: 'input-tag',
                    name: 'project_manager',
                    label: '项目经理',
                    placeholder: '请选择标签',
                    options: ['36fd32a9-c10d-47f8-9f21-ce54389add5b']
                  },
                  {
                    type: 'input-tag',
                    name: 'project_type',
                    label: '项目类型',
                    placeholder: '请选择标签',
                    options: ['develop']
                  },
                  {
                    type: 'input-tag',
                    name: 'deadline',
                    label: '截止日期',
                    placeholder: '请选择标签',
                    options: ['2023-01-28T00:00:00.000Z']
                  },
                  {
                    type: 'input-tag',
                    name: 'status',
                    label: '项目状态',
                    placeholder: '请选择标签',
                    options: ['approving']
                  },
                  {
                    type: 'input-tag',
                    name: 'account',
                    label: '客户',
                    placeholder: '请选择标签',
                    options: ['FpGqunHSCxQStcHFn_o2sunJ3vuz3uSKN4z']
                  },
                  {
                    type: 'checkbox',
                    name: 'closed',
                    label: '已关闭'
                  },
                  {
                    type: 'checkbox',
                    name: 'internal',
                    label: '内部项目'
                  }
                ]
              }
            }
          }
        ],
        body: {
          type: 'crud',
          draggable: true,
          api: {
            method: 'post',
            url: 'https://demo.steedos.cn/graphql',
            data: {
              query: `{records:project(skip: 0,top: 50,sort: "created desc"){_id name project_code project_manager status deadline account open_tasks open_issues created owner company_id company_ids locked record_permissions},count:project__count}`
            },
            headers: {
              Authorization:
                'Bearer FpGqunHSCxQStcHFn,16cd4425f03d73855ce6c76fdaacdbda1b30846c29fd7e3819df05b6e6cc1304c693dde5511b432660a08a'
            }
          },
          columns: [
            {
              name: 'name',
              label: '名称',
              type: 'text',
              toggled: true
            },
            {
              name: 'project_code',
              label: '项目编号',
              type: 'text',
              toggled: true
            },
            {
              name: 'project_manager',
              label: '项目经理',
              type: 'text',
              toggled: true,
              remark: '不知道怎么拿id再次查询space_users'
            },
            {
              name: 'status',
              label: '项目状态',
              type: 'mapping',
              toggled: true,
              map: {
                working: "<span class='label label-success'>进行中</span>",
                accepted: "<span class='label label-warning'>已验收</span>",
                approving: "<span class='label label-info'>立项中</span>",
                '*' : "<span class='label label-default'>草稿</span>"
              }
            },
            {
              name: 'deadline',
              label: '截止日期',
              type: 'text',
              toggled: true
            },
            {
              name: 'account',
              label: '客户',
              type: 'text',
              toggled: true,
              remark: '不知道怎么拿id再次查询account'
            },
            {
              name: 'open_tasks',
              label: '待完成任务',
              type: 'text',
              toggled: true
            },
            {
              name: 'open_issues',
              label: '待解决问题',
              type: 'text',
              toggled: true
            }
          ]
        }
      },
      {
        // props...
      },
      env
    );
  }
}

class APP extends React.Component<any, any> {
  render() {
    return (
      <>
        <ToastComponent key="toast" position={'top-right'} />
        <AlertComponent key="alert" />
        <AMISComponent />
      </>
    );
  }
}

export default APP;
