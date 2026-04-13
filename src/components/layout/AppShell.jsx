import { useState } from 'react'
import TabBar from './TabBar'
import CatalogView from '../catalog/CatalogView'
import ListView from '../list/ListView'
import ShoppingView from '../shopping/ShoppingView'
import HistoryView from '../history/HistoryView'
import SettingsView from '../settings/SettingsView'
import { useCatalog } from '../../hooks/useCatalog'
import { useList } from '../../hooks/useList'

export default function AppShell({ user, profile, members, updateTelegramChatId, updateIcon }) {
  const [activeTab, setActiveTab] = useState('catalog')

  const catalog = useCatalog(profile.family_id)
  const listState = useList(profile.family_id)

  const view = {
    catalog: <CatalogView catalog={catalog} listState={listState} />,
    list: (
      <ListView
        listState={listState}
        onGoToCatalog={() => setActiveTab('catalog')}
        telegramChatId={profile.telegram_chat_id}
      />
    ),
    shopping: <ShoppingView familyId={profile.family_id} profile={profile} />,
    history: (
      <HistoryView
        familyId={profile.family_id}
        listState={listState}
        onGoToList={() => setActiveTab('list')}
        chatId={profile.telegram_chat_id}
      />
    ),
    settings: (
      <SettingsView
        user={user}
        profile={profile}
        members={members}
        updateTelegramChatId={updateTelegramChatId}
        updateIcon={updateIcon}
      />
    ),
  }

  return (
    <>
      {/* Portrait layout: column flex */}
      <div className="shell-portrait" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {view[activeTab]}
        </main>
        <TabBar
          active={activeTab}
          onChange={setActiveTab}
          listCount={listState.items.length}
        />
      </div>

      {/* Landscape layout: row flex */}
      <div className="shell-landscape" style={{
        display: 'none',
        flexDirection: 'row',
        height: '100%',
      }}>
        <TabBar
          active={activeTab}
          onChange={setActiveTab}
          listCount={listState.items.length}
          variant="rail"
        />
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {view[activeTab]}
        </main>
      </div>

      <style>{`
        @media (orientation: landscape) {
          .shell-portrait { display: none !important; }
          .shell-landscape { display: flex !important; }
        }
      `}</style>
    </>
  )
}
