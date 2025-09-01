# Supabase 邮件模板中文化配置指南

## 概述

Supabase 的邮件模板需要在 Supabase 控制台中进行配置，以实现中文化。本文档提供了详细的配置步骤。

## 配置步骤

### 1. 登录 Supabase 控制台

1. 访问 [Supabase 控制台](https://supabase.com/dashboard)
2. 登录您的账户
3. 选择您的项目

### 2. 配置认证邮件模板

1. 在左侧导航栏中，点击 **Authentication**
2. 点击 **Email Templates** 选项卡
3. 您将看到以下邮件模板：

#### 确认邮箱模板 (Confirm signup)

**主题：** 确认您的邮箱地址

**内容：**
```html
<h2>确认您的邮箱地址</h2>

<p>感谢您注册我们的服务！</p>

<p>请点击下面的链接来确认您的邮箱地址：</p>

<p><a href="{{ .ConfirmationURL }}">确认邮箱</a></p>

<p>如果您没有注册我们的服务，请忽略此邮件。</p>

<p>此链接将在24小时后过期。</p>

<p>谢谢！<br>
您的团队</p>
```

#### 邀请用户模板 (Invite user)

**主题：** 您被邀请加入我们的平台

**内容：**
```html
<h2>您被邀请加入我们的平台</h2>

<p>您好！</p>

<p>您被邀请加入我们的平台。请点击下面的链接来设置您的密码：</p>

<p><a href="{{ .ConfirmationURL }}">接受邀请</a></p>

<p>如果您不想加入，请忽略此邮件。</p>

<p>此链接将在24小时后过期。</p>

<p>谢谢！<br>
您的团队</p>
```

#### 魔法链接模板 (Magic Link)

**主题：** 您的登录链接

**内容：**
```html
<h2>您的登录链接</h2>

<p>您好！</p>

<p>请点击下面的链接来登录您的账户：</p>

<p><a href="{{ .ConfirmationURL }}">登录</a></p>

<p>如果您没有请求此链接，请忽略此邮件。</p>

<p>此链接将在1小时后过期。</p>

<p>谢谢！<br>
您的团队</p>
```

#### 更改邮箱地址模板 (Change Email Address)

**主题：** 确认您的新邮箱地址

**内容：**
```html
<h2>确认您的新邮箱地址</h2>

<p>您好！</p>

<p>您请求更改您的邮箱地址。请点击下面的链接来确认您的新邮箱地址：</p>

<p><a href="{{ .ConfirmationURL }}">确认新邮箱</a></p>

<p>如果您没有请求此更改，请忽略此邮件。</p>

<p>此链接将在24小时后过期。</p>

<p>谢谢！<br>
您的团队</p>
```

#### 重置密码模板 (Reset Password)

**主题：** 重置您的密码

**内容：**
```html
<h2>重置您的密码</h2>

<p>您好！</p>

<p>您请求重置您的密码。请点击下面的链接来设置新密码：</p>

<p><a href="{{ .ConfirmationURL }}">重置密码</a></p>

<p>如果您没有请求重置密码，请忽略此邮件。</p>

<p>此链接将在1小时后过期。</p>

<p>谢谢！<br>
您的团队</p>
```

### 3. 保存配置

1. 对于每个模板，点击 **Save** 按钮保存更改
2. 确保所有模板都已更新为中文版本

### 4. 测试邮件模板

1. 在您的应用中测试注册、登录、重置密码等功能
2. 检查收到的邮件是否使用了中文模板
3. 确认所有链接都能正常工作

## 注意事项

1. **变量占位符**：请保留模板中的变量占位符（如 `{{ .ConfirmationURL }}`），这些是 Supabase 自动替换的
2. **HTML 格式**：邮件模板支持 HTML 格式，您可以添加样式和格式
3. **测试环境**：建议先在测试环境中配置和测试邮件模板
4. **备份**：在修改模板之前，建议先备份原始的英文模板

## 自定义样式

您可以为邮件模板添加 CSS 样式来改善外观：

```html
<style>
  body {
    font-family: 'Microsoft YaHei', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  .button {
    display: inline-block;
    padding: 12px 24px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    margin: 16px 0;
  }
</style>

<div class="container">
  <h2>确认您的邮箱地址</h2>
  <!-- 邮件内容 -->
  <a href="{{ .ConfirmationURL }}" class="button">确认邮箱</a>
</div>
```

## 完成

配置完成后，您的 Supabase 应用将发送中文邮件给用户，提供更好的本地化体验。