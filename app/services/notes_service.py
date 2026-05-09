'''
このファイルは、コントローラーの役割を果たし、Routesから呼び出される関数を定義します。
これらの関数は、ビジネスロジックを実装し、Repositoryを呼び出してデータベース操作を行います。
コントローラーは、RoutesとRepositoryの間の橋渡し役を果たし、アプリケーションのロジックを整理するのに役立ちます。'''

import app.repositories.note_repository  as note_repository
from app.dto.fusen_data import FusenData

class NoteService:
    def __init__(self):
        self.note_repo = note_repository.NoteRepository()

    def create_note(self, note_data : FusenData):
        if len(note_data.content) > 100:
            error_message = "100文字を超える内容を入力しています。"
            return {
                "success" : False,
                "error_message" : error_message
                } 
        
        self.note_repo.create(note_data)
        # TODO:作成したノートデータを返すか検討
        return {
            "success" : True,
            } 
    
    def all_read_fusen(self):
        self.note_repo.read_all_notes()