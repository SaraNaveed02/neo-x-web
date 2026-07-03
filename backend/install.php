<?php
/**
 * One-click database installer (.env aware)
 * Open: http://localhost/time/backend/install.php
 */

require_once __DIR__ . '/app/Bootstrap.php';

use App\Bootstrap;
use App\Config\Env;
use App\Core\Database;

Bootstrap::init();

header('Content-Type: text/html; charset=UTF-8');

$message = '';
$success = false;
$mysqlOk = false;
$dbOk = false;
$userCount = 0;
$dbName = Env::get('DB_NAME', 'nexura_db') ?? 'nexura_db';

function checkDatabaseStatus(string $dbName): array
{
    $status = ['mysql' => false, 'database' => false, 'users' => 0, 'error' => ''];

    try {
        $pdo = Database::serverConnection();
        $status['mysql'] = true;

        $pdo->exec('USE `' . str_replace('`', '``', $dbName) . '`');
        $status['database'] = true;
        $status['users'] = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    } catch (Throwable $e) {
        $status['error'] = $e->getMessage();
    }

    return $status;
}

$status = checkDatabaseStatus($dbName);
$mysqlOk = $status['mysql'];
$dbOk = $status['database'];
$userCount = $status['users'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$mysqlOk) {
        $message = 'MySQL is not running — start MySQL in XAMPP, then try again.';
    } else {
        try {
            $pdo = Database::serverConnection();
            $sqlFile = __DIR__ . '/database/abv.sql';
            if (!is_file($sqlFile)) {
                $sqlFile = __DIR__ . '/database/abs.sql';
            }
            if (!is_file($sqlFile)) {
                $sqlFile = __DIR__ . '/database/nexura_complete.sql';
            }

            $sql = file_get_contents($sqlFile);
            $sql = preg_replace('/--[^\n]*\n/', "\n", $sql);
            $statements = array_filter(array_map('trim', explode(';', $sql)));

            foreach ($statements as $statement) {
                if ($statement === '') {
                    continue;
                }
                try {
                    $pdo->exec($statement);
                } catch (PDOException $e) {
                    // Ignore duplicate/non-critical during re-install
                }
            }

            require_once __DIR__ . '/includes/site-stats.php';
            $pdo->exec('USE `' . str_replace('`', '``', $dbName) . '`');
            seedDefaultSiteStats($pdo);

            $adminHash = password_hash('admin123', PASSWORD_BCRYPT);
            $pdo->prepare(
                "INSERT INTO users (username, name, email, password, role, is_active, auth_provider, email_verified)
                 VALUES ('admin', 'Admin', 'admin@neoxweb.com', ?, 'admin', 1, 'email', 1)
                 ON DUPLICATE KEY UPDATE password = VALUES(password), role = 'admin', is_active = 1"
            )->execute([$adminHash]);

            $pdo->exec("UPDATE settings SET setting_value = 'supportneoxweb@gmail.com' WHERE setting_key = 'contact_email'");
            $pdo->exec("UPDATE settings SET setting_value = '+92 314 066 6734' WHERE setting_key = 'contact_phone'");
            $pdo->exec("UPDATE settings SET setting_value = '923140666734' WHERE setting_key = 'whatsapp_number'");

            $success = true;
            $message = 'Database installed from abv.sql! Login: <strong>admin</strong> / <strong>admin123</strong>';
            $status = checkDatabaseStatus($dbName);
            $dbOk = $status['database'];
            $userCount = $status['users'];
        } catch (Throwable $e) {
            $message = 'Error: ' . htmlspecialchars($e->getMessage());
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install Database | NEOXWEB</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-4">
    <div class="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 class="text-2xl font-bold mb-2 text-center">NEOXWEB Database Install</h1>
        <p class="text-slate-400 text-sm mb-6 text-center">Uses <code>database/abv.sql</code> — full schema + admin user</p>

        <div class="mb-6 p-4 rounded-xl text-sm space-y-2 border <?php echo ($mysqlOk && $dbOk) ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'; ?>">
            <p class="<?php echo $mysqlOk ? 'text-emerald-300' : 'text-red-300'; ?>">
                <?php echo $mysqlOk ? '✓ MySQL running' : '✗ MySQL OFF — start in XAMPP'; ?>
            </p>
            <p class="<?php echo $dbOk ? 'text-emerald-300' : 'text-amber-300'; ?>">
                <?php echo $dbOk ? "✓ Database <code>{$dbName}</code> connected ({$userCount} users)" : '○ Database not installed yet'; ?>
            </p>
            <p class="text-slate-400 text-xs">Config: <code>backend/.env</code> (copy from .env.example)</p>
        </div>

        <?php if ($message): ?>
            <div class="mb-6 p-4 rounded-xl text-sm <?php echo $success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'; ?>">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>

        <form method="post">
            <button type="submit" <?php echo $mysqlOk ? '' : 'disabled'; ?>
                class="w-full py-3 rounded-xl font-semibold mb-4 <?php echo $mysqlOk ? 'bg-gradient-to-r from-violet-600 to-emerald-500' : 'bg-slate-700 text-slate-400 cursor-not-allowed'; ?>">
                <?php echo $dbOk ? 'Re-install / Repair Database' : 'Install Database Now'; ?>
            </button>
        </form>

        <div class="text-sm text-slate-400 space-y-2 border-t border-slate-800 pt-4">
            <p><strong class="text-white">Default admin</strong></p>
            <p>Username: <code class="text-violet-300">admin</code></p>
            <p>Password: <code class="text-emerald-300">admin123</code> (stored as bcrypt hash in DB)</p>
        </div>

        <div class="mt-6 flex flex-col gap-2 text-sm">
            <a href="index.php" class="text-violet-400 hover:underline">→ Admin Login</a>
            <a href="api/health.php" class="text-slate-400 hover:underline">→ API Health Check</a>
            <a href="confirm.php" class="text-slate-400 hover:underline">→ Backend Confirm Tests</a>
        </div>
    </div>
</body>
</html>
