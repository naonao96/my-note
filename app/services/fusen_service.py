'''
このファイルは、コントローラーの役割を果たし、Routesから呼び出される関数を定義します。
これらの関数は、ビジネスロジックを実装し、Repositoryを呼び出してデータベース操作を行います。
コントローラーは、RoutesとRepositoryの間の橋渡し役を果たし、アプリケーションのロジックを整理するのに役立ちます。'''

from app.repositories.fusen_repo  import FusenRepository
from app.dto.fusen_data import FusenData
from app.models.fusen_model import Fusen

class FusenService:
    def __init__(self):
        self.note_repo : FusenRepository = FusenRepository()

    def create_note(self, fusen_data : FusenData):
        if len(fusen_data.content) > 100:
            error_message : str = "100文字を超える内容を入力しています。"
            return {
                "success" : False,
                "error_message" : error_message
                } 
        
        # dtoからModelへデータを受け渡す
        fusen_model : Fusen = Fusen(
            content = fusen_data.content,
            expires_at = fusen_data.expires_at,
            color = fusen_data.color
        )

        self.note_repo.create(fusen_model)
        # TODO:作成したノートデータを返すか検討
        return {
            "success" : True,
            } 
    
    def all_read_fusen(self):
        fusen_list_model : list[Fusen] = self.note_repo.read_all_notes()
        fusen_list : list[FusenData] = []

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
    
    def del_fusen(self, note_id):
        if (self.note_repo.delete(note_id)):
            return True
        return False