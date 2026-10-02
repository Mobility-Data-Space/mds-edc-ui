"use client";
import { createInstance } from "i18next";
import { useRouter } from "next/router.js";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from "react-i18next";
import { en } from "@/i18n/translations/en";

type TranslatorFn = (key: string, values?: Record<string, string>) => string;

interface TranslatorContextType {
  translator: TranslatorFn;
  globalTranslator: TranslatorFn;
}

const TranslatorContext = createContext<TranslatorContextType>(
  {} as TranslatorContextType,
);
export function TranslatorProvider({ children }: PropsWithChildren) {
  const value = useInitTranslator();
  return (
    <TranslatorContext.Provider value={value}>
      <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
    </TranslatorContext.Provider>
  );
}

export function useTranslator(): TranslatorContextType {
  return useContext(TranslatorContext);
}

interface TranslateProps {
  string: string;
  global?: boolean;
  delimiter?: string;
}

function Translate({ string, global = false }: TranslateProps): string {
  const { translator, globalTranslator } = useTranslator();
  const t = global ? globalTranslator : translator;
  return t(string);
}

export const DELIMITER = ", ";

export function MultiTranslate({
  string,
  delimiter = DELIMITER,
  global = false,
}: TranslateProps): string {
  const { translator, globalTranslator } = useTranslator();
  const t = global ? globalTranslator : translator;

  if (typeof string != "string") {
    string = JSON.stringify(string);
  }

  const stringArray = string.split(delimiter);
  return stringArray.length === 1
    ? t(string)
    : stringArray.map((str) => t(str)).join(delimiter);
}

export const T = Translate;

const i18nInstance = createInstance({
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en,
  },
});

i18nInstance.use(initReactI18next).init();

const useInitTranslator = (): TranslatorContextType => {
  const { t } = useTranslation();
  const { locale } = useRouter();

  useEffect(() => {
    i18nInstance.changeLanguage(locale);
  }, [locale]);

  return useMemo(
    () => ({
      translator: t,
      globalTranslator: (value: string) => t(`_app.${value}`),
    }),
    [t],
  );
};
