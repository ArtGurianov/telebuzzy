import { ValueOf } from "@mydaogs/core";

export const CODEBLOCKS_KEYS = {
  javascript: "javascript",
  go: "go",
  bash: "bash",
  php: "php",
  python: "python",
} as const;
export type CodeblockKey = ValueOf<typeof CODEBLOCKS_KEYS>;

export const CODEBLOCKS_ORDER: CodeblockKey[] = [
  CODEBLOCKS_KEYS.bash,
  CODEBLOCKS_KEYS.javascript,
  CODEBLOCKS_KEYS.go,
  CODEBLOCKS_KEYS.python,
  CODEBLOCKS_KEYS.php,
];

export const CODEBLOCKS: Record<CodeblockKey, string> = {
  [CODEBLOCKS_KEYS.javascript]: `const response = await fetch("https://telebuzzy.xyz/api/notify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    apiKey: process.env.TELEBUZZY_API_KEY,
    title: "From My Business",
    action: "New customer",
    email: user.email,
    timestamp: new Date().toISOString(),
  }),
});
if (!response.ok) {
  const { error } = await response.json();
  console.error(response.status, error);
}`,
  [CODEBLOCKS_KEYS.go]: `data := map[string]any{
	"apiKey":    os.Getenv("TELEBUZZY_API_KEY"),
	"title":     "From My Business",
	"action":    "New customer",
	"email":     "user@example.com",
	"timestamp": time.Now().Format(time.RFC3339),
}

jsonData, _ := json.Marshal(data)
resp, err := http.Post(
	"https://telebuzzy.xyz/api/notify",
	"application/json",
	bytes.NewBuffer(jsonData),
)
if err == nil {
	defer resp.Body.Close()
}`,
  [CODEBLOCKS_KEYS.python]: `response = requests.post("https://telebuzzy.xyz/api/notify", json={
    "apiKey": os.getenv("TELEBUZZY_API_KEY"),
    "title": "From My Business",
    "action": "New customer",
    "email": user.email,
    "timestamp": datetime.now(timezone.utc).isoformat(),
})
if not response.ok:
    print(response.status_code, response.json()["error"])`,
  [CODEBLOCKS_KEYS.php]: `<?php
$data = [
    'apiKey' => getenv('TELEBUZZY_API_KEY'),
    'title' => 'From My Business',
    'action' => 'New customer',
    'email' => $user['email'],
    'timestamp' => date(DATE_ATOM),
];

$ch = curl_init('https://telebuzzy.xyz/api/notify');

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
]);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);
?>`,
  [CODEBLOCKS_KEYS.bash]: `curl -X POST https://telebuzzy.xyz/api/notify \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "'"$TELEBUZZY_API_KEY"'",
    "title": "From My Business",
    "action": "New customer",
    "email": "'"$USER_EMAIL"'",
    "timestamp": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
  }'`,
};
