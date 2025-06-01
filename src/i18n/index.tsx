import { createInstance } from "i18next";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { cn } from "./translations/cn";
import { de } from "./translations/de";
import { en } from "./translations/en";

type TranslatorFn = (key: string) => string;

interface TranslatorContextType {
  translator: TranslatorFn;
  globalTranslator: TranslatorFn;
}

export interface TranslatorProviderProps extends TranslatorContextType {
  Setup: ({ children }: PropsWithChildren) => JSX.Element;
}

const TranslatorContext = createContext<TranslatorContextType>({} as any);
export function TranslatorProvider({
  children,
}: PropsWithChildren<{}>) {
  const { Setup, translator, globalTranslator } = useInitTranslator();
  return (
    <TranslatorContext.Provider
      value={{
        translator,
        globalTranslator,
      }}
    >
      <Setup>{children}</Setup>
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

export function Translate(
  { string, global = false }: TranslateProps,
): string {
  const { translator, globalTranslator } = useTranslator();
  const t = global ? globalTranslator : translator;
  return t(string);
}

export const DELIMITER = ", ";

export function MultiTranslate(
  { string, delimiter = DELIMITER, global = false }: TranslateProps,
): string {
  const { translator, globalTranslator } = useTranslator();
  const t = global ? globalTranslator : translator;

  if(typeof string != "string"){
    string = JSON.stringify(string)
  }

  const stringArray = string.split(delimiter);
  return stringArray.length === 1 ?
    t(string) :
    stringArray
      .map(str => t(str))
      .join(delimiter);
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
    de,
    cn,
  },
});

i18nInstance.use(initReactI18next).init();

const useInitTranslator = (): TranslatorProviderProps => {
  const { t } = useTranslation();
  const { locale, route } = useRouter();

  // const i18nInstance = useMemo(() => {

  // i18nInstance.changeLanguage(locale);
  // return i18nInstance;
  // }, [locale]);

  useEffect(() => {
    i18nInstance.changeLanguage(locale);
  }, [locale]);

  return {
    Setup: ({ children }) => (
      <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
    ),
    translator: t,
    globalTranslator: (value) => t(`_app.${value}`),
  };
};
