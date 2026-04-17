
import { useEffect } from "react";
import { Investor } from "../types";

interface TawkChatProps {
  user: Investor | null;
}

function TawkChat({ user }: TawkChatProps) {
  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Pre-set visitor attributes if user exists
    if (user) {
      window.Tawk_API.visitor = {
        name: user.name,
        email: user.email
      };
    }

    const scriptId = 'tawk-script';
    if (!document.getElementById(scriptId)) {
      (function () {
        const s1 = document.createElement("script");
        const s0 = document.getElementsByTagName("script")[0];

        s1.id = scriptId;
        s1.async = true;
        s1.src = "https://embed.tawk.to/69b266979131281c388407ac/1jjge1h1p";
        s1.charset = "UTF-8";
        s1.setAttribute("crossorigin", "*");

        if (s0 && s0.parentNode) {
          s0.parentNode.insertBefore(s1, s0);
        } else {
          document.head.appendChild(s1);
        }
      })();
    }

    const setAttributes = () => {
      if (window.Tawk_API && typeof window.Tawk_API.setAttributes === 'function' && user) {
        // We remove the callback to prevent "Socket server did not execute the callback" errors
        // which occur when the connection is unstable or the widget is not fully ready.
        window.Tawk_API.setAttributes({
          name: user.name,
          email: user.email,
          phone: user.phone,
          whatsapp: user.whatsapp,
          investorUniqueId: user.investorUniqueId 
        });
      }
    };

    window.Tawk_API.onLoad = setAttributes;

    // If already loaded, set attributes immediately
    setAttributes();

  }, [user]);

  return null;
}

export default TawkChat;
