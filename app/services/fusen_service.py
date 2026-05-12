'''
このファイルは、コントローラーの役割を果たし、Routesから呼び出される関数を定義します。
これらの関数は、ビジネスロジックを実装し、Repositoryを呼び出してデータベース操作を行います。
コントローラーは、RoutesとRepositoryの間の橋渡し役を果たし、アプリケーションのロジックを整理するのに役立ちます。'''

import app.repositories.fusen_repo  as fusen_repo
from app.dto.fusen_data import FusenData
from app.models.fusen_model import Fusen

class NoteService:
    def __init__(self):
        self.note_repo = fusen_repo.FusenRepository()

    def create_note(self, fusen_data : FusenData):
        if len(fusen_data.content) > 100:
            error_message = "100文字を超える内容を入力しています。"
            return {
                "success" : False,
                "error_message" : error_message
                } 
        
        # dtoからModelへデータを受け渡す
        fusen_model = Fusen(
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
        self.note_repo.read_all_notes()