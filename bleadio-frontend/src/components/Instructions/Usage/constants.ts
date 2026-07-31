import { ValueOf } from "@/lib/types";

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
  [CODEBLOCKS_KEYS.javascript]: `await fetch('https://blead.io/api/notify', {
    method: "POST",
    body: JSON.stringify({
      apiKey: process.env.BLEADIO_API_KEY,
      title: "From My Business",
      action: "New customer",
      email: user.email,
      timestamp: new Date.now().toLocaleString(),
    }),
  });`,
  [CODEBLOCKS_KEYS.go]: `data := map[string]interface{}{
		"apiKey":   os.Getenv("BLEADIO_API_KEY"),
		"title":    "From My Business",
		"action":   "New customer",
		"email":    "user@example.com",
		"timestamp": time.Now().Format(time.RFC3339),
	}

	jsonData, _ := json.Marshal(data)
	_, err := http.Post(
    "https://blead.io/api/notify",
    "application/json",
    bytes.NewBuffer(jsonData)
  )`,
  [CODEBLOCKS_KEYS.python]: `requests.post("https://blead.io/api/notify", json={
    "apiKey": os.getenv["BLEADIO_API_KEY"],
    "title": "From My Business",
    "action": "New customer",
    "email": user.email,
    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
})`,
  [CODEBLOCKS_KEYS.php]: `<?php
$data = [
    'apiKey' => getenv('BLEADIO_API_KEY'),
    'title' => 'From My Business',
    'action' => 'New customer',
    'email' => $user['email'],
    'timestamp' => date('Y-m-d H:i:s'),
];

$ch = curl_init('https://blead.io/api/notify');

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
]);

$response = curl_exec($ch);

curl_close($ch);
?>`,
  [CODEBLOCKS_KEYS.bash]: `curl -X POST https://blead.io/api/notify
  -H "Content-Type: application/json"
  -d '{
    "apiKey": "'"$BLEADIO_API_KEY"'",
    "title": "From My Business",
    "action": "New customer",
    "email": "'"$USER_EMAIL"'",
    "timestamp": "'"$TIMESTAMP"'"
  }'`,
};
