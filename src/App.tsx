import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  return (
    // 这里未来可以加全局 Provider，比如 Antd 的 ConfigProvider
    // <ConfigProvider theme={...}>
      <RouterProvider router={router} />
    // </ConfigProvider>
  );
}

export default App;