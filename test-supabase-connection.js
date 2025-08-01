import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://anwwblcjzmykznimqmxu.supabase.co/'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFud3dibGNqem15a3puaW1xbXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MzUzNzYsImV4cCI6MjA2OTUxMTM3Nn0.Y9tK0G0H3WRdHUSRCv8FhmqwS5sJCJ6CKMUAUQ1vzk8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('测试Supabase连接...')
    
    // 测试基本连接
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.error('❌ 数据库连接失败:', error.message)
      
      if (error.message.includes('relation "users" does not exist')) {
        console.log('\n💡 解决方案:')
        console.log('1. 数据库表尚未创建，请运行以下SQL脚本:')
        console.log('   - database/init.sql')
        console.log('   - database/personalization_extension.sql')
        console.log('2. 在Supabase控制台的SQL编辑器中执行这些脚本')
        console.log('3. 或者使用提供的HTML测试文件: test-database-setup.html')
      }
      
      return false
    }
    
    console.log('✅ Supabase连接成功!')
    console.log('📊 数据库状态正常')
    return true
    
  } catch (err) {
    console.error('❌ 连接测试失败:', err.message)
    return false
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection().then(success => {
    if (success) {
      console.log('\n🎉 所有功能应该可以正常使用了!')
    } else {
      console.log('\n⚠️  需要先设置数据库才能使用高级功能')
    }
    process.exit(success ? 0 : 1)
  })
}

export { testConnection }