"""
このファイルはサービス層です。
Routesから呼び出され、アプリケーションのビジネスロジックを担当します。
Repositoryを利用してデータの取得・更新を行い、
ModelとDTOの変換も担当します。
"""

from app.repositories.fusen_repo  import FusenRepository
from app.dto.fusen_data import FusenData
from app.models.fusen_model import Fusen
import app.common.messages as Msg

class FusenService:
    def __init__(self):
        self.note_repo : FusenRepository = FusenRepository()

    def fusen_create(self, fusen_data : FusenData):
        if len(fusen_data.content) > 100:
            return {"success" : False} 
        
        # dtoからModelへデータを受け渡す
        fusen_model : Fusen = Fusen(
            content = fusen_data.content,
            expires_at = fusen_data.expires_at,
            color = fusen_data.color
        )
        result: bool = self.note_repo.create(fusen_model)

        return {"success" : result}
    
    def fusen_all_read(self):
        fusen_list_model : list[Fusen] = self.note_repo.read_all_notes()
        fusen_list : list[FusenData] = []

        if (not fusen_list_model):
            return []

        for fusen in fusen_list_model:
            dto = FusenData(
                id = fusen.id,
                # ユーザーIDはログイン機能実装後解禁
                # user_id = fusen.user_id,
                content = fusen.content,
                created_at= fusen.created_at,
                updated_at= fusen.updated_at,
                expires_at= fusen.expires_at,
                color= fusen.color,
                status= fusen.status
            )

            fusen_list.append(dto)
        
        return fusen_list
    
    def fusen_read(self, note_id : int):
        fusen_model : Fusen = self.note_repo.read_note(note_id)

        if (fusen_model is None):
            return None
        
        return FusenData(
            id= fusen_model.id,
            content=fusen_model.content,
            color=fusen_model.color,
            expires_at=fusen_model.expires_at,
            created_at=fusen_model.created_at,
            updated_at=fusen_model.updated_at,
            status=fusen_model.status
            )
    
    def fusen_delete(self, note_id : int):
        return self.note_repo.delete(note_id)
