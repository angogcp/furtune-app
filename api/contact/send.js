// API endpoint for sending contact form emails
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, subject, message, type } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message || !type) {
    return res.status(400).json({ error: '请填写所有必填字段' });
  }

  try {
    // In a real implementation, you would use a service like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - AWS SES
    // - Resend
    // etc.
    
    // For now, we'll simulate sending the email
    const emailData = {
      to: 'waiwai1212faq@2925.com',
      subject: `神秘占卜馆 - ${type === 'feedback' ? '用户反馈' : '客服咨询'}: ${subject}`,
      body: `类型：${type === 'feedback' ? '用户反馈' : '客服咨询'}\n\n` +
            `姓名：${name}\n` +
            `邮箱：${email}\n` +
            `电话：${phone || '未提供'}\n` +
            `主题：${subject}\n\n` +
            `详细内容：\n${message}\n\n` +
            `发送时间：${new Date().toLocaleString('zh-CN')}\n\n` +
            `来自：神秘占卜馆联系表单`
    };

    // Log the email data (in production, this would actually send the email)
    console.log('Email would be sent:', emailData);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demonstration, we'll always return success
    // In a real implementation, you would handle actual email sending errors
    return res.status(200).json({ 
      success: true, 
      message: '邮件发送成功！我们会尽快回复您。' 
    });
    
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      error: '邮件发送失败，请稍后重试或直接联系客服' 
    });
  }
}