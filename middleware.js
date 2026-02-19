import { NextResponse } from 'next/server';

export function middleware(req) {
    // 環境変数から認証情報を取得（設定がない場合はデフォルト値を使用）
    const basicAuthUser = process.env.BASIC_AUTH_USER || 'admin';
    const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD || 'password123';

    // Basic認証ヘッダーを取得
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
        // ヘッダーの値（"Basic base64user:pass"）を解析
        const authValue = basicAuth.split(' ')[1];
        const [user, pwd] = atob(authValue).split(':');

        // ユーザー名とパスワードが一致すればアクセス許可
        if (user === basicAuthUser && pwd === basicAuthPassword) {
            return NextResponse.next();
        }
    }

    // 認証失敗または未認証の場合は401エラーを返し、ブラウザに認証ダイアログを表示させる
    return new NextResponse('Authentication Required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    });
}

// ミドルウェアを適用するパスの指定
// APIルートや画像などの静的ファイル(_next)以外のすべてのページに適用するのが一般的ですが、
// APIの不正利用を防ぐため、今回はAPIルートも含めて保護します。
// ただし、Next.jsの内部リソース(_next)や静的ファイルは除外します。
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
