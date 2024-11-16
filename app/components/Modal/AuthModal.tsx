// components/Modal/AuthModal.tsx

import React, { useState } from 'react';
import styles from '../../style.module.css';

interface AuthModalProps {
  isSignUpModalOpen: boolean;
  setIsSignUpModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoginMode: boolean;
  setIsLoginMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleAuthSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleLogout: () => void;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isSignUpModalOpen,
  setIsSignUpModalOpen,
  isLoginMode,
  setIsLoginMode,
  handleAuthSubmit,
  handleLogout,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  if (!isSignUpModalOpen) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent}>
        {/* ログインモードの内容 */}
        {isLoginMode ? (
          <>
            <h2 className="text-xl font-bold mb-4">Log IN</h2>
            <form onSubmit={handleAuthSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <button type="submit" className={styles.modalButton}>
                Log IN
              </button>
            </form>
          </>
        ) : (
          // サインアップモードの内容
          <>
            <h2 className="text-xl font-bold mb-4">Sign UP</h2>
            <form onSubmit={handleAuthSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <button type="submit" className={styles.modalButton}>
                Sign UP
              </button>
            </form>
          </>
        )}

        {/* 横棒 */}
        <div className="my-4 border-t border-gray-300" />

        {/* 新規登録の誘導テキスト */}
        <div className="text-center mb-4">
          {isLoginMode ? (
            <p>
              アカウントをお持ちでないですか？{' '}
              <span
                onClick={() => setIsLoginMode(false)}
                className="text-blue-500 cursor-pointer"
              >
                新規登録はこちら
              </span>
            </p>
          ) : (
            <p>
              すでにアカウントをお持ちですか？{' '}
              <span
                onClick={() => setIsLoginMode(true)}
                className="text-blue-500 cursor-pointer"
              >
                ログインはこちら
              </span>
            </p>
          )}
        </div>

        {/* モーダルを閉じるボタン */}
        <button
          type="button"
          onClick={() => setIsSignUpModalOpen(false)}
          className={styles.modalButtonclose}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
