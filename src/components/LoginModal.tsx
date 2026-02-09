import  { useState } from 'react';
import { X, Smartphone, Lock, PawPrint, User, KeyRound } from 'lucide-react';
import request from '@/utils/request';
// 引入全局 Store
import { useAuthStore } from '@/store/useAuthStore';

// 图片资源常量
const CAT_IMAGE_URL = "../../../public/kuku.png?q=80&w=400&h=400&fit=crop";
const QR_CODE = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://petplanet.com";

const LoginModal = () => {
  // ✅ 1. 从 Store 获取状态和方法
  const { isLoginModalOpen, closeLoginModal, login } = useAuthStore();

  // ✅ 2. 本地表单状态
  const [loginMethod, setLoginMethod] = useState<'phone' | 'account'>('phone');
  
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // ✅ 3. 如果 Store 说不显示，就直接返回 null
  if (!isLoginModalOpen) return null;

  // --- 逻辑处理区域 ---

  const handleGetCode = () => {
    if (countdown > 0) return;
    if (!phone) return alert("请输入手机号");
    setCountdown(60);
    // 这里可以加一个定时器递减逻辑，为了演示简化处理
    alert("验证码已发送(模拟)");
  };

  const handleLogin = async () => {
    if (!agreed) return alert("请先阅读并同意《星际通行法则》");

    let payload = {};
    
    // 根据登录方式构造参数
    if (loginMethod === 'phone') {
      if (!phone || !code) return alert("请输入手机号和验证码");
      payload = { phone, code, login_type: 'mobile' };
    } else {
      if (!username || !password) return alert("请输入账号和密码");
      payload = { username, password, login_type: 'password' };
    }

    try {
      // 发起请求
      const data: any = await request.post('/auth/login', payload);
      
      // 兼容处理返回结构
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user;

      if (!token || !user) throw new Error("登录失败：数据异常");

      // ✅ 登录成功：通知 Store
      login(token, user);

    } catch (error: any) {
      console.error("登录失败:", error);
      alert(error.message || "登录失败");
    }
  };

  // --- UI 渲染区域 ---

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-4">
      {/* 背景遮罩 - 点击关闭 */}
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" 
        onClick={closeLoginModal}
      ></div>

      {/* 弹窗主体 */}
      <div className="relative z-10 bg-white rounded-[32px] shadow-2xl flex w-full max-w-[850px] h-[520px] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* === 左侧：星球氛围区 === */}
        <div className="w-[320px] bg-[#2D1B4E] relative flex flex-col items-center justify-center p-8 text-white overflow-hidden group">
          {/* 背景装饰 */}
          <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-32 left-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-700 opacity-40"></div>
          <div className="absolute bottom-20 left-12 w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce delay-1000 opacity-50"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl pointer-events-none hover:bg-primary-500/20 transition-colors duration-700"></div>

          {/* 猫咪圆形头像 - 使用了 CAT_IMAGE_URL */}
          <div className="mb-8 relative z-10">
            <div className="group w-[220px] h-[220px] rounded-full overflow-hidden border-[6px] border-white/10 shadow-2xl transition-all duration-700 ease-out group-hover:border-primary-400/40 cursor-pointer">
              <img src={CAT_IMAGE_URL} alt="Pet Planet Cat" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110" />
            </div>
          </div>

          <div className="relative z-10 text-center">
            <h3 className="text-xl font-bold mb-2 tracking-wider">欢迎回到宠物星球</h3>
            <p className="text-xs text-purple-300 mb-6">连接每一位铲屎官的宇宙信号</p>
            
            {/* 二维码区域 - 使用了 QR_CODE */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 mx-auto w-fit transition-transform duration-500 hover:scale-110 cursor-pointer">
              <img src={QR_CODE} className="w-24 h-24 opacity-90" alt="QR" />
            </div>
            
            <p className="text-xs text-purple-300 mt-4 opacity-80">
                请使用 <span className="font-bold text-[#07C160]">微信</span> 扫码登船
            </p>
          </div>
        </div>

        {/* === 右侧：登录表单区 === */}
        <div className="flex-1 bg-white p-12 relative flex flex-col justify-center">
          <PawPrint className="absolute bottom-[-20px] right-[-20px] text-gray-50 opacity-[0.03] rotate-[-12deg]" size={300} />

          {/* 右上角关闭按钮 - 使用 closeLoginModal */}
          <button onClick={closeLoginModal} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
            
          {/* 切换登录方式按钮 - 使用 setLoginMethod */}
          <button 
            onClick={() => setLoginMethod(loginMethod === 'phone' ? 'account' : 'phone')}
            className="absolute bottom-6 right-6 text-sm font-bold text-primary-500 hover:text-orange-600 transition-colors z-20 flex items-center gap-1"
          >
            {loginMethod === 'phone' ? '切换到账号密码登录' : '切换到手机验证码登录'}
          </button>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
                {loginMethod === 'phone' ? '登船验证' : '账号登录'}
            </h3>
            <p className="text-gray-400 text-sm mt-2">
                {loginMethod === 'phone' ? '请输入您的身份信息以进入舱段' : '欢迎回来，指挥官'}
            </p>
          </div>

          {/* 表单输入区 */}
          <div className="space-y-5 z-10">
            {loginMethod === 'phone' ? (
                /* === 手机号登录模式 - 使用 phone, setPhone, code, setCode === */
                <>
                    <div className="group flex items-center bg-[#F5F7FA] border border-transparent focus-within:border-primary-500/50 focus-within:bg-white rounded-2xl px-5 py-4 transition-all duration-300">
                        <div className="mr-4 text-gray-400 group-focus-within:text-primary-500">
                            <Smartphone size={20} />
                        </div>
                        <input 
                          type="tel" 
                          placeholder="输入手机号" 
                          value={phone} 
                          onChange={e => setPhone(e.target.value)} 
                          className="flex-1 bg-transparent border-none outline-none text-gray-800" 
                        />
                    </div>

                    <div className="group flex items-center bg-[#F5F7FA] border border-transparent focus-within:border-primary-500/50 focus-within:bg-white rounded-2xl px-5 py-4 transition-all duration-300">
                        <div className="mr-4 text-gray-400 group-focus-within:text-primary-500">
                            <Lock size={20} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="输入验证码" 
                          value={code} 
                          onChange={e => setCode(e.target.value)} 
                          className="flex-1 bg-transparent border-none outline-none text-gray-800" 
                        />
                        <button 
                          onClick={handleGetCode} 
                          disabled={countdown > 0} 
                          className={`text-sm font-bold pl-4 border-l border-gray-200 whitespace-nowrap ${countdown > 0 ? 'text-gray-400' : 'text-primary-500'}`}
                        >
                            {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                        </button>
                    </div>
                </>
            ) : (
                /* === 账号密码模式 - 使用 username, setUsername, password, setPassword === */
                <>
                    <div className="group flex items-center bg-[#F5F7FA] border border-transparent focus-within:border-primary-500/50 focus-within:bg-white rounded-2xl px-5 py-4 transition-all duration-300">
                        <div className="mr-4 text-gray-400 group-focus-within:text-primary-500">
                            <User size={20} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="请输入用户名/邮箱" 
                          value={username} 
                          onChange={e => setUsername(e.target.value)} 
                          className="flex-1 bg-transparent border-none outline-none text-gray-800" 
                        />
                    </div>

                    <div className="group flex items-center bg-[#F5F7FA] border border-transparent focus-within:border-primary-500/50 focus-within:bg-white rounded-2xl px-5 py-4 transition-all duration-300">
                        <div className="mr-4 text-gray-400 group-focus-within:text-primary-500">
                            <KeyRound size={20} />
                        </div>
                        <input 
                          type="password" 
                          placeholder="请输入登录密码" 
                          value={password} 
                          onChange={e => setPassword(e.target.value)} 
                          className="flex-1 bg-transparent border-none outline-none text-gray-800" 
                        />
                    </div>
                </>
            )}

            {/* 登录按钮 */}
            <button 
              onClick={handleLogin} 
              className="w-full bg-gradient-to-r from-primary-500 to-orange-600 hover:from-orange-600 hover:to-primary-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <PawPrint size={18} className="rotate-12" />
              {loginMethod === 'phone' ? '立即登船' : '登录'}
            </button>
          </div>

          {/* 协议勾选 - 使用 agreed, setAgreed */}
          <div className="flex items-center gap-2 mt-6 z-10">
            <input 
              type="checkbox" 
              checked={agreed} 
              onChange={e => setAgreed(e.target.checked)} 
              className="w-4 h-4 accent-primary-500 cursor-pointer rounded" 
            />
            <label className="text-xs text-gray-400 cursor-pointer select-none" onClick={() => setAgreed(!agreed)}>
              我已阅读并同意 <span className="text-primary-500 hover:underline">《星际通行法则》</span>
            </label>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginModal;