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

const PrivacyPolicyPage = () => {
  // Hooks
  const t = useTranslations('privacyPolicy')
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
                    欢迎使用CR3DIFY金融服务平台。我们深知您的隐私对您的重要性，因此我们制定了本隐私政策来说明我们如何收集、使用、披露和保护您的个人信息。
                  </Typography>
                  <Typography variant='body1' paragraph>
                    本隐私政策适用于我们通过CR3DIFY平台提供的所有服务，包括但不限于贷款申请、账户管理、客户服务等功能。
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 信息收集 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('informationCollection')}
                  </Typography>
                  <Typography variant='h6' component='h3' gutterBottom sx={{ mt: 3 }}>
                    我们收集的信息类型
                  </Typography>
                  <Typography variant='body1' paragraph>
                    为了向您提供优质的金融服务，我们可能会收集以下类型的信息：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>个人身份信息：</strong>姓名、身份证号码、出生日期、联系方式等
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>财务信息：</strong>收入状况、银行账户信息、信用记录、资产负债情况等
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>技术信息：</strong>IP地址、设备信息、浏览器类型、操作系统等
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>使用信息：</strong>您在平台上的操作记录、偏好设置、交易历史等
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 信息使用 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('informationUsage')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    我们使用收集的信息用于以下目的：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      提供和改进我们的金融服务
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      处理贷款申请和进行风险评估
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      验证您的身份和防范欺诈
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      遵守法律法规和监管要求
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      向您发送重要通知和服务更新
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      分析和改善用户体验
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 信息保护 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('informationProtection')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    我们采用行业标准的安全措施来保护您的个人信息：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>加密技术：</strong>使用SSL/TLS加密传输敏感数据
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>访问控制：</strong>严格限制员工对个人信息的访问权限
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>安全监控：</strong>24/7监控系统安全状态
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>定期审计：</strong>定期进行安全评估和漏洞扫描
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>员工培训：</strong>定期对员工进行隐私保护培训
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 信息共享 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('informationSharing')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    我们不会出售、租赁或以其他方式向第三方披露您的个人信息，除非：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      获得您的明确同意
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      法律法规要求或政府部门要求
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      与我们的服务提供商共享（如征信机构、支付处理商）
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      保护我们的合法权益或防范欺诈
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 您的权利 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('yourRights')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    您对自己的个人信息享有以下权利：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>访问权：</strong>您有权了解我们收集了您的哪些个人信息
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>更正权：</strong>您有权要求我们更正不准确的个人信息
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>删除权：</strong>在特定情况下，您有权要求我们删除您的个人信息
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>限制处理权：</strong>您有权要求我们限制对您个人信息的处理
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>数据可携权：</strong>您有权要求我们以结构化格式提供您的个人信息
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Cookie政策 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('cookiePolicy')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    我们使用Cookie和类似技术来改善您的用户体验。Cookie是存储在您设备上的小型文本文件，帮助我们：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      记住您的登录状态和偏好设置
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      分析网站使用情况和性能
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      提供个性化的服务和内容
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      确保网站安全性
                    </Typography>
                  </Box>
                  <Typography variant='body1' paragraph>
                    您可以通过浏览器设置管理Cookie偏好，但请注意，禁用某些Cookie可能会影响网站功能。
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 联系我们 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('contactUs')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      <strong>邮箱：</strong>privacy@cr3dify.com
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

                {/* 政策更新 */}
                <Box mb={4}>
                  <Typography variant='h5' component='h2' gutterBottom>
                    {t('policyUpdates')}
                  </Typography>
                  <Typography variant='body1' paragraph>
                    我们可能会不时更新本隐私政策以反映我们服务的变化或法律要求的变更。当我们对隐私政策进行重大修改时，我们会：
                  </Typography>
                  <Box component='ul' sx={{ pl: 3 }}>
                    <Typography component='li' variant='body1' paragraph>
                      在网站上发布更新后的政策
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      通过邮件或站内通知告知您
                    </Typography>
                    <Typography component='li' variant='body1' paragraph>
                      在必要时征求您的同意
                    </Typography>
                  </Box>
                  <Typography variant='body1' paragraph>
                    我们建议您定期查看本隐私政策以了解最新信息。
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 生效日期 */}
                <Box textAlign='center'>
                  <Typography variant='body2' color='text.secondary'>
                    本隐私政策自2024年3月15日起生效
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

export default PrivacyPolicyPage