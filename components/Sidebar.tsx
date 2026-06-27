"use client";

import {
  BarChart3,
  ClipboardList,
  Clock3,
  FileText,
  Home,
  Phone,
  Plus,
  Settings,
  Users,
} from "lucide-react";

const menu = [
  {
    title: "Početna",
    icon: Home,
    active: true,
  },
  {
    title: "Statistika",
    icon: BarChart3,
  },
  {
    title: "Istorija",
    icon: Clock3,
  },
];

const other = [
  {
    title: "Klijenti",
    icon: Users,
  },
  {
    title: "Podešavanja",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside
      className="
        hidden
        lg:flex
        w-72
        h-screen
        flex-col
        bg-[#0B1220]
        border-r
        border-slate-800
        p-6
      "
    >
      {/* LOGO */}
      <div className="flex items-center gap-3 mb-12">
        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-gradient-to-br
            from-green-400
            to-blue-500
            flex
            items-center
            justify-center
          "
        >
          <BarChart3 size={20} />
        </div>

        <div>
          <h1 className="text-white font-bold text-xl">
            Daily Tracker
          </h1>
        </div>
      </div>

      {/* MENU */}
      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className={`
                flex
                items-center
                gap-3
                w-full
                px-4
                py-3
                rounded-xl
                transition
                ${
                  item.active
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }
              `}
            >
              <Icon size={18} />
              {item.title}
            </button>
          );
        })}
      </nav>

      {/* SPACER */}
      <div className="flex-1" />

      {/* OTHER */}
      <div className="mb-6">
        <p className="text-slate-500 text-sm mb-3 uppercase">
          Ostalo
        </p>

        <div className="space-y-2">
          {other.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                className="
                  flex
                  items-center
                  gap-3
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  text-slate-400
                  hover:bg-slate-900
                  hover:text-white
                  transition
                "
              >
                <Icon size={18} />
                {item.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* QUICK ADD */}
      <div
        className="
          bg-gradient-to-br
          from-blue-600
          to-indigo-700
          rounded-2xl
          p-5
        "
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-semibold">
              Brzi unos
            </h3>

            <p className="text-blue-100 text-sm mt-2">
              Dodaj anketu ili ponudu jednim klikom.
            </p>
          </div>

          <button
            className="
              w-10
              h-10
              rounded-full
              bg-white/20
              flex
              items-center
              justify-center
            "
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}