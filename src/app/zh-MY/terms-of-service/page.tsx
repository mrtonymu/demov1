'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'

// Next Intl Imports
import { useTranslations } from 'next-intl'

const TermsOfServicePage = () => {
  // Hooks
  const t = useTranslations('termsOfService')
  const tCommon = useTranslations('common')

  return (
    <Container maxWidth='lg'>
      <Box py={4}>
        {/* 面包屑导航 */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link href='/zh-MY/dashboard' underline='hover'>
            {tCommon('dashboard')}
          </Link>
          <Typography color='text.primary'>
            {t('title')}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                {/* 标题 */}
                <Box textAlign='center' mb={4}>
                  <Typography variant='h3' component='h1' gutterBottom>
                    {t('title')}
                  </Typography>
                  <Typography variant='body1' color='text.secondary'>
                    {t('lastUpdated')}: 2024年3月15日
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 引言 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('introduction')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    欢迎使用CR3DIFY金融服务平台（以下简称&ldquo;本平台&rdquo;或&ldquo;我们的服务&rdquo;）。本使用条款（以下简称&ldquo;条款&rdquo;）构成您与CR3DIFY之间具有法律约束力的协议。
                  </Typography>
                  <Typography variant='body1' paragraph>
                    通过访问或使用我们的服务，您同意受本条款的约束。如果您不同意这些条款，请不要使用我们的服务。
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 服务描述 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('serviceDescription')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    CR3DIFY是一个综合性金融服务平台，提供以下服务：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      个人和企业贷款服务
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      信用评估和风险管理
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      财务咨询和规划服务
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      在线账户管理和交易处理
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      客户支持和技术服务
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 用户资格 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('userEligibility')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    要使用我们的服务，您必须：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      年满18岁且具有完全民事行为能力
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      是马来西亚的合法居民或在马来西亚有合法身份
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      提供真实、准确、完整的个人信息
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      遵守所有适用的法律法规
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      未被任何金融监管机构列入黑名单
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 账户注册 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('accountRegistration')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    注册账户时，您需要：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      提供准确的个人信息和联系方式
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      创建安全的密码并妥善保管
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      完成身份验证程序
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      同意接受我们的服务条款和隐私政策
                    </Typography>
                  </Box>
                  <Typography variant='body1' paragraph>
                    您有责任维护账户信息的准确性和安全性。如发现账户被盗用或存在安全风险，请立即联系我们。
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 贷款服务条款 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('loanServiceTerms')}
                  </Typography>
                  <Typography variant='h6' component='h3' gutterBottom sx={{ mt: 3 }}>
                    申请流程
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      所有贷款申请需经过我们的审核程序
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      我们保留批准或拒绝任何贷款申请的权利
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      贷款条件将根据您的信用状况和风险评估确定
                    </Typography>
                  </Box>
                  
                  <Typography variant='h6' component='h3' gutterBottom sx={{ mt: 3 }}>
                    还款义务
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      借款人必须按照约定的时间和金额还款
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      逾期还款将产生滞纳金和利息
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      严重逾期可能导致法律后果
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 费用和收费 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('feesAndCharges')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    使用我们的服务可能涉及以下费用：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>贷款利息：</strong>根据贷款类型和期限确定
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>手续费：</strong>贷款处理和管理费用
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>逾期费用：</strong>延迟还款产生的罚金
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>提前还款费：</strong>提前偿还贷款的手续费
                    </Typography>
                  </Box>
                  <Typography variant='body1' paragraph>
                    所有费用将在贷款协议中明确说明，我们承诺不收取隐藏费用。
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 用户行为准则 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('userConduct')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    使用我们的服务时，您不得：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      提供虚假或误导性信息
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      从事任何欺诈或非法活动
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      干扰或破坏我们的系统和服务
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      未经授权访问他人账户或信息
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      违反任何适用的法律法规
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 知识产权 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('intellectualProperty')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    本平台的所有内容，包括但不限于：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      软件、代码和技术
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      文本、图像和多媒体内容
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      商标、标志和品牌元素
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      数据库和算法
                    </Typography>
                  </Box>
                  <Typography variant='body1' paragraph>
                    均受知识产权法保护，归CR3DIFY或其许可方所有。未经明确授权，您不得复制、修改、分发或商业使用这些内容。
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 免责声明 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('disclaimer')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    我们的服务按&ldquo;现状&rdquo;提供，我们不对以下事项承担责任：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      服务的不间断或无错误运行
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      第三方服务或内容的准确性
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      因技术故障导致的损失
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      市场波动或经济变化的影响
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 责任限制 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('limitationOfLiability')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    在法律允许的最大范围内，CR3DIFY对以下损失不承担责任：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      间接、特殊、偶然或后果性损害
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      利润损失、数据丢失或业务中断
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      超过您支付给我们的费用总额的损失
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 争议解决 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('disputeResolution')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    如果发生争议，我们鼓励通过以下方式解决：
                  </Typography>
                  <Box component='ol' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>协商：</strong>首先通过友好协商解决
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>调解：</strong>通过第三方调解机构调解
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>仲裁：</strong>提交马来西亚仲裁中心仲裁
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>诉讼：</strong>向马来西亚法院提起诉讼
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 服务终止 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('serviceTermination')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    我们保留在以下情况下暂停或终止您的账户的权利：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      违反本使用条款
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      提供虚假信息或从事欺诈行为
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      长期不活跃或未使用服务
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      法律法规要求或监管部门指令
                    </Typography>
                  </Box>
                  <Typography variant='body1' paragraph>
                    账户终止后，您仍需履行所有未完成的义务。
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 联系信息 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('contactInformation')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    如果您对本使用条款有任何疑问，请联系我们：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>邮箱：</strong>legal@cr3dify.com
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>电话：</strong>+60-3-1234-5678
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>地址：</strong>马来西亚吉隆坡市中心金融区
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>工作时间：</strong>周一至周五 9:00-18:00
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 条款修改 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('termsModification')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    我们可能会不时修改本使用条款。重大修改将通过以下方式通知您：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      在网站上发布更新通知
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      通过邮件或短信通知
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      在您下次登录时显示提醒
                    </Typography>
                  </Box>
                  <Typography variant='body1' paragraph>
                    继续使用我们的服务即表示您接受修改后的条款。
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 生效日期 */}
                <Box textAlign='center'>
                  <Typography variant='body2' color='text.secondary'>
                    本使用条款自2024年3月15日起生效
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default TermsOfServicePage