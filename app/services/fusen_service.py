"""
このファイルはサービス層です。
Routesから呼び出され、アプリケーションのビジネスロジックを担当します。
Repositoryを利用してデータの取得・更新を行い、
ModelとDTOの変換も担当します。
"""
from app.repositories.fusen_repo  import FusenRepository
from app.dto.fusen_data import FusenData
from app.models.fusen_model import Fusen
from app.validators.fusen_validator import vld_content

class FusenService:
    def __init__(self) -> None:
        self.fusen_repo : FusenRepository = FusenRepository()

    def fusen_create(self, fusen_data : FusenData) -> None:
        vld_content(fusen_data.content)
        self.fusen_repo.create(FusenData.to_model(fusen_data))
    
    def fusen_all_read(self, user_id : int) -> list:
        fusen_list_model : list[Fusen] = self.fusen_repo.read_all_fusen(user_id)
        fusen_list : list[FusenData] = []
        if (not fusen_list_model):
            return []
        
        for model in fusen_list_model:
            fusen_list.append(FusenData.from_model(model))
        
        return fusen_list
    
    def fusen_read(self, fusen_id : int, user_id : int) -> FusenData:
        return FusenData.from_model(self.fusen_repo.read_fusen(fusen_id, user_id))
    
    def fusen_update(self, fusen_data : FusenData) -> None:
        vld_content(fusen_data.content)
        self.fusen_repo.update(FusenData.to_model(fusen_data))
    
    def fusen_delete(self, fusen_id : int, user_id : int) -> None:
        self.fusen_repo.delete(fusen_id, user_id)
    

