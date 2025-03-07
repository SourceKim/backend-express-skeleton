-- 为askbudda_user用户授予从任何主机连接的权限
CREATE USER IF NOT EXISTS 'askbudda_user'@'%' IDENTIFIED BY 'askbudda_password';
GRANT ALL PRIVILEGES ON `ask_budda`.* TO 'askbudda_user'@'%';

CREATE USER IF NOT EXISTS 'askbudda_user'@'localhost' IDENTIFIED BY 'askbudda_password';
GRANT ALL PRIVILEGES ON `ask_budda`.* TO 'askbudda_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES; 